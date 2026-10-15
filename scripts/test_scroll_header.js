const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outputPath = path.resolve(__dirname, 'header_scrolled_preview.png');

// Create temporary html that triggers scroll or loads index.html with scroll script
const tempHtml = path.resolve(__dirname, 'temp_scroll.html');
const indexHtml = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');

// Inject script to scroll down 250px on load
const injected = indexHtml.replace('</body>', `<script>
  window.addEventListener('load', () => {
    window.scrollTo(0, 350);
    document.querySelector('.header').classList.add('scrolled');
  });
</script></body>`);

fs.writeFileSync(tempHtml, injected);

const cmd = `"${chromePath}" --headless=new --screenshot="${outputPath}" --window-size=1440,900 --hide-scrollbars "file://${tempHtml}"`;
console.log('Capturing scrolled header preview...');
execSync(cmd);
console.log('Saved header_scrolled_preview.png');

fs.unlinkSync(tempHtml);
