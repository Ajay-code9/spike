const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const artifactDir = 'C:\\Users\\ASUS\\.gemini\\antigravity\\brain\\9eb3e780-0833-444a-bded-826b43c3f430';

const targets = [
  { url: 'http://localhost:3000/index.html', name: 'hero_index_desktop', w: 1440, h: 900 },
  { url: 'http://localhost:3000/index.html', name: 'hero_index_mobile', w: 375, h: 812 },
  { url: 'http://localhost:3000/metals.html', name: 'hero_metals_desktop', w: 1440, h: 900 },
  { url: 'http://localhost:3000/metals.html', name: 'hero_metals_mobile', w: 375, h: 812 },
  { url: 'http://localhost:3000/compare-accounts.html', name: 'hero_compare_desktop', w: 1440, h: 900 },
  { url: 'http://localhost:3000/compare-accounts.html', name: 'hero_compare_mobile', w: 375, h: 812 },
  { url: 'http://localhost:3000/why-choose-spike.html', name: 'hero_why_desktop', w: 1440, h: 900 },
  { url: 'http://localhost:3000/why-choose-spike.html', name: 'hero_why_mobile', w: 375, h: 812 }
];

for (const t of targets) {
  const outPath = path.join(artifactDir, `${t.name}.png`);
  console.log(`Capturing ${t.name} (${t.w}x${t.h})...`);
  const cmd = `"${chromePath}" --headless=new --screenshot="${outPath}" --window-size=${t.w},${t.h} --hide-scrollbars "${t.url}"`;
  try {
    execSync(cmd);
    console.log(`Saved: ${outPath}`);
  } catch (err) {
    console.error(`Failed ${t.name}:`, err.message);
  }
}
console.log('All hero screenshots captured successfully.');
