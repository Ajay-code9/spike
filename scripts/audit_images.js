const fs = require('fs');

const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));
let totalImages = 0;
let lazyImages = 0;
let missingLazy = 0;
const missingByFile = {};

for (const file of htmlFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const matches = content.match(/<img[^>]+>/g) || [];
  totalImages += matches.length;
  matches.forEach(m => {
    // Brand logo in header should NOT be lazy loaded (it's above the fold)
    if (m.includes('brand-logo') || m.includes('logo.jpg') || m.includes('logo.svg')) {
      return;
    }
    if (m.includes('loading="lazy"')) {
      lazyImages++;
    } else {
      missingLazy++;
      if (!missingByFile[file]) missingByFile[file] = [];
      missingByFile[file].push(m);
    }
  });
}

console.log('Total non-logo img tags:', lazyImages + missingLazy);
console.log('With loading="lazy":', lazyImages);
console.log('Missing loading="lazy":', missingLazy);
console.log('Files missing lazy loading:');
for (const f in missingByFile) {
  console.log(`  ${f}: ${missingByFile[f].length} images missing lazy loading`);
}
