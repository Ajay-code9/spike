const fs = require('fs');
const path = require('path');

const dir = path.resolve(__dirname, '..');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') && f !== 'video-tutorials.html');

console.log(`Processing ${files.length} HTML files...`);

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // 1. Header Dropdown
  content = content.replace(
    /<a href="video-tutorials\.html" class="dropdown-link"(.*?)>Video Tutorials<\/a>/g,
    '<a href="trading-glossary.html" class="dropdown-link"$1>Trading Glossary</a>'
  );

  // 2. Specific footer links & CTA buttons
  content = content.replace(
    /<a href="video-tutorials\.html" class="btn btn-outline btn-lg">\s*Explore Video Tutorials\s*<\/a>/g,
    '<a href="trading-glossary.html" class="btn btn-outline btn-lg">Explore Trading Glossary</a>'
  );

  content = content.replace(
    /<li><a href="video-tutorials\.html" class="footer-link">Video Tutorials<\/a><\/li>/g,
    '<li><a href="trading-glossary.html" class="footer-link">Trading Glossary (A-Z)</a></li>'
  );

  content = content.replace(
    /<li><a href="video-tutorials\.html">Video Tutorials<\/a><\/li>/g,
    '<li><a href="trading-glossary.html">Trading Glossary (A-Z)</a></li>'
  );

  content = content.replace(
    /<li><a href="video-tutorials\.html">Video Tutorials &amp; Masterclasses<\/a><\/li>/g,
    '<li><a href="trading-glossary.html">Trading Glossary (A-Z)</a></li>'
  );

  content = content.replace(
    /<li><a href="video-tutorials\.html" class="footer-link">Trading Academy<\/a><\/li>/g,
    '<li><a href="trading-glossary.html" class="footer-link">Trading Glossary</a></li>'
  );

  content = content.replace(
    /<li><a href="video-tutorials\.html">Trading Academy<\/a><\/li>/g,
    '<li><a href="trading-glossary.html">Trading Glossary</a></li>'
  );

  content = content.replace(
    /<li><a href="video-tutorials\.html" class="footer-link">Live Webinars<\/a><\/li>/g,
    '<li><a href="trading-glossary.html#alphabet-bar" class="footer-link">Financial Lexicon</a></li>'
  );

  // Any remaining generic video-tutorials.html link
  content = content.replace(/href="video-tutorials\.html"/g, 'href="trading-glossary.html"');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${file}`);
  } else {
    console.log(`No changes needed: ${file}`);
  }
});

console.log('Finished updating glossary links across all pages.');
