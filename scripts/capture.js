const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const page = process.argv[2] || 'forex.html';
const name = process.argv[3] || 'forex_preview.png';
const outPath = path.resolve(__dirname, '..', name);
const brainPath = path.resolve('C:\\Users\\ASUS\\.gemini\\antigravity\\brain\\9eb3e780-0833-444a-bded-826b43c3f430', name);

const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const cmd = `"${chrome}" --headless=new --screenshot="${brainPath}" --window-size=1440,2400 --hide-scrollbars http://localhost:3000/${page}`;

console.log('Running:', cmd);
try {
  execSync(cmd, { stdio: 'inherit' });
  console.log('Exists in brainPath:', fs.existsSync(brainPath));
} catch (e) {
  console.error(e);
}
