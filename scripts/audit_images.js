const fs = require('fs');
const glob = fs.readdirSync('.');
const htmlFiles = glob.filter(f => f.endsWith('.html'));

const imageUsage = {};
const pageImages = {};

htmlFiles.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const matches = [...content.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi)];
  pageImages[f] = [];
  matches.forEach(m => {
    const src = m[1];
    if (src.includes('logo') || src.includes('flag') || src.includes('avatar') || src.endsWith('.svg')) return;
    if (!imageUsage[src]) imageUsage[src] = [];
    imageUsage[src].push(f);
    pageImages[f].push(src);
  });
});

console.log('=== DUPLICATE / REPEATED IMAGES ===');
let duplicates = 0;
for (const [src, pages] of Object.entries(imageUsage)) {
  if (pages.length > 1) {
    console.log(`❌ ${src} used ${pages.length} times in: ${pages.join(', ')}`);
    duplicates++;
  }
}
if (duplicates === 0) console.log('None! All images are unique across pages.');

console.log('\n=== PER-PAGE IMAGES LIST ===');
for (const [page, imgs] of Object.entries(pageImages)) {
  if (imgs.length > 0) {
    console.log(`\n📄 ${page} (${imgs.length} images):`);
    // Check internal duplicates within same page
    const counts = {};
    imgs.forEach(img => counts[img] = (counts[img] || 0) + 1);
    for (const [img, count] of Object.entries(counts)) {
      if (count > 1) {
        console.log(`  ⚠️ SAME PAGE DUPLICATE: ${img} (${count}x)`);
      } else {
        console.log(`  ✓ ${img}`);
      }
    }
  }
}
