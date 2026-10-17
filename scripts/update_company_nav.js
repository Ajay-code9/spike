const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const htmlFiles = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));

console.log(`Processing ${htmlFiles.length} HTML files...`);

htmlFiles.forEach(file => {
  const filePath = path.join(rootDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // 1. Update dropdown links
  // Pattern: <a href="(index.html)?#trust" class="dropdown-link">Why Choose Spike</a>
  content = content.replace(/href=["'](index\.html)?#trust["']\s+class=["']dropdown-link(["'])/g, 'href="why-choose-spike.html" class="dropdown-link$2');
  content = content.replace(/href=["'](index\.html)?#numbers["']\s+class=["']dropdown-link(["'])/g, 'href="spike-in-numbers.html" class="dropdown-link$2');

  // Also reverse attribute order if any
  content = content.replace(/class=["']dropdown-link["']\s+href=["'](index\.html)?#trust["']/g, 'class="dropdown-link" href="why-choose-spike.html"');
  content = content.replace(/class=["']dropdown-link["']\s+href=["'](index\.html)?#numbers["']/g, 'class="dropdown-link" href="spike-in-numbers.html"');

  // 2. Update footer links
  content = content.replace(/href=["'](index\.html)?#trust["']\s+class=["']footer-link(["'])/g, 'href="why-choose-spike.html" class="footer-link$2');
  content = content.replace(/href=["'](index\.html)?#numbers["']\s+class=["']footer-link(["'])/g, 'href="spike-in-numbers.html" class="footer-link$2');
  content = content.replace(/class=["']footer-link["']\s+href=["'](index\.html)?#trust["']/g, 'class="footer-link" href="why-choose-spike.html"');
  content = content.replace(/class=["']footer-link["']\s+href=["'](index\.html)?#numbers["']/g, 'class="footer-link" href="spike-in-numbers.html"');

  // Footer link in footer-links
  content = content.replace(/href=["'](index\.html)?#trust["']/g, (match, p1, offset) => {
    // Check context around offset
    const context = content.slice(Math.max(0, offset - 150), Math.min(content.length, offset + 150));
    if (context.includes('footer') || context.includes('dropdown') || context.includes('nav')) {
      return 'href="why-choose-spike.html"';
    }
    return match;
  });

  content = content.replace(/href=["'](index\.html)?#numbers["']/g, (match, p1, offset) => {
    const context = content.slice(Math.max(0, offset - 150), Math.min(content.length, offset + 150));
    if (context.includes('footer') || context.includes('dropdown') || context.includes('nav') || context.includes('link-arrow')) {
      return 'href="spike-in-numbers.html"';
    }
    return match;
  });

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});

console.log('Update finished.');
