const fs = require('fs');
const pages = [
  'index.html', 'forex.html', 'metals.html', 'indices.html', 'commodities.html',
  'shares.html', 'crypto.html', 'markets.html', 'spreads.html', 'platforms.html',
  'accounts.html', 'account-types.html', 'compare-accounts.html', 'how-to-open.html',
  'education.html', 'trading-glossary.html', 'market-analysis.html', 'why-choose-spike.html',
  'spike-in-numbers.html', 'video-tutorials.html'
];

pages.forEach(p => {
  if (!fs.existsSync(p)) return;
  const content = fs.readFileSync(p, 'utf8');
  const matches = [...content.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi)];
  const nonLogo = matches.filter(m => 
    !m[1].includes('logo') && 
    !m[1].includes('flag') && 
    !m[1].includes('avatar') &&
    !m[1].endsWith('.svg')
  );
  if (nonLogo.length > 0) {
    console.log('=== ' + p + ' ===');
    nonLogo.forEach(m => console.log('  ' + m[1]));
  }
});
