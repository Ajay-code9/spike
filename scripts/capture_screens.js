const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9225;

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
  const chromeProc = spawn(CHROME, [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--user-data-dir=C:\\Users\\ASUS\\AppData\\Local\\Temp\\chrome-shots-profile',
    'about:blank'
  ]);

  await sleep(1500);

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
  await sendCommand('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  const shots = [
    { page: 'index.html', out: 'screen-index-calc.png', eval: `
      const el = document.querySelector('.calculator-preview-section');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
    ` },
    { page: 'video-tutorials.html', out: 'screen-video-modal.png', eval: `
      if (window.SpikeVideo) {
        window.SpikeVideo.play('Advanced Confluence Strategy: London & NY Open', 'Institutional Trading Desk', '42:15', 'Master high-probability London Open breakout mechanics, Asian range equilibrium, and New York reversal confirmations.');
      }
    ` },
    { page: 'metals.html', out: 'screen-metals-gold.png', eval: `
      const el = document.querySelector('.tradingview-widget-container');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
    ` },
    { page: 'market-analysis.html', out: 'screen-analysis-desk.png', eval: `
      if (window.SpikeToast) {
        window.SpikeToast.info('Market Desk Bulletin', 'Federal Reserve FOMC statement commentary updated by Zurich Macro Desk.');
      }
    ` }
  ];

  for (const s of shots) {
    await sendCommand('Page.navigate', { url: `http://localhost:3000/${s.page}` });
    await sleep(1200);
    if (s.eval) {
      await sendCommand('Runtime.evaluate', { expression: s.eval });
      await sleep(600);
    }
    const shotRes = await sendCommand('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(shotRes.data, 'base64');
    fs.writeFileSync(path.join(__dirname, '../public', s.out), buffer);
    console.log(`Saved screenshot: ${s.out}`);
  }

  ws.close();
  chromeProc.kill();
  console.log('All screenshots captured!');
}

run().catch(console.error);
