const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9226;

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
    '--user-data-dir=C:\\Users\\ASUS\\AppData\\Local\\Temp\\chrome-shots-p2',
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

  // 1. Desktop Viewport (1440x900)
  await sendCommand('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  // Top header desktop check
  await sendCommand('Page.navigate', { url: 'http://localhost:3000/index.html' });
  await sleep(1200);
  let shot = await sendCommand('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(__dirname, '../public/screen-top-header-desktop.png'), Buffer.from(shot.data, 'base64'));
  console.log('Saved: screen-top-header-desktop.png');

  // Metals page top header check
  await sendCommand('Page.navigate', { url: 'http://localhost:3000/metals.html' });
  await sleep(1200);
  shot = await sendCommand('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(__dirname, '../public/screen-metals-header.png'), Buffer.from(shot.data, 'base64'));
  console.log('Saved: screen-metals-header.png');

  // 2. Mobile Viewport (375x812)
  await sendCommand('Emulation.setDeviceMetricsOverride', {
    width: 375,
    height: 812,
    deviceScaleFactor: 2,
    mobile: true
  });

  await sendCommand('Page.navigate', { url: 'http://localhost:3000/index.html' });
  await sleep(1200);
  shot = await sendCommand('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(__dirname, '../public/screen-top-header-mobile.png'), Buffer.from(shot.data, 'base64'));
  console.log('Saved: screen-top-header-mobile.png');

  ws.close();
  chromeProc.kill();
  console.log('Verification shots finished!');
}

run().catch(console.error);
