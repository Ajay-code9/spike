const fs = require('fs');
const glob = fs.readdirSync('.').filter(f => f.endsWith('.html'));
let missing = 0;
let total = 0;

glob.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const matches = [...content.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi)];
  matches.forEach(m => {
    const src = m[1];
    if (src.startsWith('http') || src.startsWith('data:')) return;
    total++;
    if (!fs.existsSync(src)) {
      console.error(`❌ MISSING FILE in ${f}: ${src}`);
      missing++;
    }
  });
});

console.log(`Checked ${total} image references across ${glob.length} HTML files.`);
if (missing === 0) {
  console.log('✅ ALL images exist on disk!');
} else {
  console.log(`❌ Found ${missing} missing images!`);
}
