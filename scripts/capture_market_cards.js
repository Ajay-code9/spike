const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9223;

function sleep(ms) {
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
    '--user-data-dir=C:\\Users\\ASUS\\AppData\\Local\\Temp\\chrome-cards-profile',
    'about:blank'
  ]);

  await sleep(1500);

  try {
    const targets = await fetchJson(`http://127.0.0.1:${PORT}/json`);
    const pageTarget = targets.find(t => t.type === 'page') || targets[0];
    const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

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

    // 1. Markets.html - Desktop
    await sendCommand('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });

    await sendCommand('Page.navigate', { url: 'http://localhost:3000/markets.html' });
    await sleep(2500);

    // Scroll to .asset-hub-grid
    await sendCommand('Runtime.evaluate', {
      expression: `
        const el = document.querySelector('.asset-hub-grid');
        if (el) el.scrollIntoView({ block: 'start' });
      `
    });
    await sleep(1000);

    const shotMarkets = await sendCommand('Page.captureScreenshot', { format: 'png' });
    const artifactDir = 'C:\\Users\\ASUS\\.gemini\\antigravity\\brain\\9eb3e780-0833-444a-bded-826b43c3f430';
    fs.writeFileSync(path.join(artifactDir, 'markets_real_cards_desktop.png'), Buffer.from(shotMarkets.data, 'base64'));
    console.log('Saved markets_real_cards_desktop.png');

    // 2. Index.html - Desktop
    await sendCommand('Page.navigate', { url: 'http://localhost:3000/index.html' });
    await sleep(2500);

    await sendCommand('Runtime.evaluate', {
      expression: `
        const el = document.querySelector('.instruments-tall-cards-row');
        if (el) el.scrollIntoView({ block: 'start' });
      `
    });
    await sleep(1000);

    const shotIndex = await sendCommand('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(artifactDir, 'index_real_cards_desktop.png'), Buffer.from(shotIndex.data, 'base64'));
    console.log('Saved index_real_cards_desktop.png');

    ws.close();
  } catch (err) {
    console.error('Error during capture:', err);
  } finally {
    chromeProc.kill();
  }
}

run();
