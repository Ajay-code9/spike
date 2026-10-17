const fs = require('fs');

const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));
let updatedCount = 0;

for (const file of htmlFiles) {
  let content = fs.readFileSync(file, 'utf8');
  let fileUpdated = false;

  content = content.replace(/<img\s+([^>]+)>/gi, (fullMatch, attrs) => {
    // Skip brand logo or already lazy images
    if (attrs.includes('logo.jpg') || attrs.includes('logo.svg') || attrs.includes('brand-logo')) {
      return fullMatch;
    }
    if (attrs.includes('loading=')) {
      return fullMatch;
    }

    updatedCount++;
    fileUpdated = true;
    return `<img loading="lazy" decoding="async" ${attrs}>`;
  });

  if (fileUpdated) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated images in ${file}`);
  }
}

console.log(`Total images updated with loading="lazy" decoding="async": ${updatedCount}`);
