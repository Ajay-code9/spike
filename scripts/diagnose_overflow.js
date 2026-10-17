const { spawn } = require('child_process');
const http = require('http');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9222;

const PAGES = [
  'index.html',
  'forex.html',
  'metals.html',
  'indices.html',
  'commodities.html',
  'shares.html',
  'crypto.html',
  'markets.html',
  'spreads.html',
  'platforms.html',
  'accounts.html',
  'account-types.html',
  'compare-accounts.html',
  'how-to-open.html',
  'education.html',
  'trading-glossary.html',
  'market-analysis.html',
  'why-choose-spike.html',
  'spike-in-numbers.html',
  'video-tutorials.html'
];

const VIEWPORTS = [
  { name: 'Mobile-Small-320', width: 320, height: 568 },
  { name: 'Mobile-375', width: 375, height: 812 },
  { name: 'Mobile-414', width: 414, height: 896 },
  { name: 'Tablet-768', width: 768, height: 1024 },
  { name: 'Laptop-1024', width: 1024, height: 768 },
  { name: 'Desktop-1440', width: 1440, height: 900 }
];

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

async function run() {
  console.log('Launching Chrome in headless mode with remote debugging...');
  const chromeProc = spawn(CHROME, [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--user-data-dir=C:\\Users\\ASUS\\AppData\\Local\\Temp\\chrome-debug-profile',
    'about:blank'
  ]);

  await sleep(1500);

  let version;
  try {
    version = await fetchJson(`http://127.0.0.1:${PORT}/json/version`);
    console.log('Connected to Chrome version:', version['Browser']);
  } catch (e) {
    console.error('Failed to connect to Chrome:', e.message);
    chromeProc.kill();
    return;
  }

  const targets = await fetchJson(`http://127.0.0.1:${PORT}/json`);
  const pageTarget = targets.find(t => t.type === 'page') || targets[0];
  const wsUrl = pageTarget.webSocketDebuggerUrl;

  const ws = new WebSocket(wsUrl);
  let msgId = 1;
  const pending = new Map();

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.id && pending.has(data.id)) {
      const { resolve, reject } = pending.get(data.id);
      pending.delete(data.id);
      if (data.error) reject(data.error);
      else resolve(data.result);
    }
  };

  await new Promise(r => ws.onopen = r);

  function sendCommand(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = msgId++;
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await sendCommand('Page.enable');
  await sendCommand('Runtime.enable');

  const report = {};

  for (const vp of VIEWPORTS) {
    console.log(`\n================ Testing Viewport: ${vp.name} (${vp.width}x${vp.height}) ================`);
    report[vp.name] = [];

    await sendCommand('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 1,
      mobile: vp.width < 768
    });

    for (const page of PAGES) {
      const url = `http://localhost:3000/${page}`;
      await sendCommand('Page.navigate', { url });
      await sleep(600); // Wait for layout & fonts

      const evalRes = await sendCommand('Runtime.evaluate', {
        expression: `
          (() => {
            const docWidth = document.documentElement.clientWidth;
            const scrollWidth = document.documentElement.scrollWidth;
            const overflowing = [];
            const all = document.querySelectorAll('*');
            for (const el of all) {
              const rect = el.getBoundingClientRect();
              if (rect.right > docWidth + 1.5) {
                // Ignore script, style, head, etc.
                if (['SCRIPT', 'STYLE', 'HEAD', 'META', 'TITLE', 'LINK'].includes(el.tagName)) continue;
                overflowing.push({
                  tag: el.tagName.toLowerCase(),
                  id: el.id || '',
                  class: (typeof el.className === 'string' ? el.className.trim() : ''),
                  width: Math.round(rect.width),
                  right: Math.round(rect.right),
                  excess: Math.round(rect.right - docWidth)
                });
              }
            }
            // Sort by excess descending
            overflowing.sort((a, b) => b.excess - a.excess);
            return {
              docWidth,
              scrollWidth,
              hasOverflow: scrollWidth > docWidth + 1,
              excessTotal: scrollWidth - docWidth,
              topItems: overflowing.slice(0, 4)
            };
          })()
        `,
        returnByValue: true
      });

      const res = evalRes.result.value;
      if (res.hasOverflow) {
        console.log(`❌ [${page}] OVERFLOW DETECTED: docWidth=${res.docWidth}, scrollWidth=${res.scrollWidth} (Diff: +${res.excessTotal}px)`);
        res.topItems.forEach(item => {
          console.log(`   -> <${item.tag} class="${item.class}" id="${item.id}"> width=${item.width}px, excess=+${item.excess}px`);
        });
        report[vp.name].push({ page, ...res });
      } else {
        process.stdout.write(`✅ ${page} | `);
      }
    }
    console.log('');
  }

  console.log('\n================ SUMMARY OF OVERFLOWS ================');
  let totalIssues = 0;
  for (const vp in report) {
    console.log(`Viewport ${vp}: ${report[vp].length} pages with overflow`);
    totalIssues += report[vp].length;
  }
  console.log(`Total overflow issues: ${totalIssues}`);

  ws.close();
  chromeProc.kill();
}

run().catch(console.error);
