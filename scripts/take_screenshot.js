const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const width = process.argv[2] || '1440';
const height = process.argv[3] || '3600';
const fileOut = process.argv[4] || 'section5_preview.png';
const outputPath = path.resolve(__dirname, fileOut);

// Use Chrome to take screenshot of index.html
const cmd = `"${chromePath}" --headless=new --screenshot="${outputPath}" --window-size=${width},${height} --hide-scrollbars http://localhost:3000/index.html`;

console.log(`Running Chrome screenshot ${width}x${height}...`);
execSync(cmd);
console.log('Saved screenshot to:', outputPath);
