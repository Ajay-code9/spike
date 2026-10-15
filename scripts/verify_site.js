const fs = require('fs');
const path = require('path');
const http = require('http');

console.log('=== SPIKE BROKERAGE WEBSITE VERIFICATION ===');

const pages = [
  'index.html',
  'platforms.html',
  'accounts.html',
  'markets.html',
  'education.html'
];

let totalErrors = 0;

// 1. Verify pages exist and check linked assets
pages.forEach(page => {
  if (!fs.existsSync(page)) {
    console.error(`[ERROR] Missing page: ${page}`);
    totalErrors++;
    return;
  }
  const content = fs.readFileSync(page, 'utf8');
  console.log(`[PASS] Page ${page} exists (${content.length} bytes)`);

  // Extract all src="..."
  const srcMatches = content.match(/src="([^"]+)"/g) || [];
  srcMatches.forEach(srcAttr => {
    const src = srcAttr.match(/src="([^"]+)"/)[1];
    if (src.startsWith('http')) return; // external
    const resolvedPath = path.resolve(__dirname, '..', src);
    if (!fs.existsSync(resolvedPath)) {
      console.error(`  [ERROR in ${page}] Missing asset: ${src}`);
      totalErrors++;
    } else {
      const stat = fs.statSync(resolvedPath);
      if (stat.size === 0) {
        console.error(`  [ERROR in ${page}] Empty asset: ${src}`);
        totalErrors++;
      }
    }
  });

  // Extract background-image: url('...')
  const bgMatches = content.match(/url\(['"]([^'"]+)['"]\)/g) || [];
  bgMatches.forEach(bgAttr => {
    const bg = bgAttr.match(/url\(['"]([^'"]+)['"]\)/)[1];
    if (bg.startsWith('http')) return;
    const resolvedPath = path.resolve(__dirname, '..', bg);
    if (!fs.existsSync(resolvedPath)) {
      console.error(`  [ERROR in ${page}] Missing background image: ${bg}`);
      totalErrors++;
    }
  });
});

// 2. Start temporary HTTP server to test real browser requests
const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';
  const filePath = path.join(__dirname, '..', reqPath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(4123, '127.0.0.1', async () => {
  console.log('Test HTTP server listening on http://127.0.0.1:4123');

  // Test fetching each page via HTTP
  for (const page of pages) {
    await new Promise(resolve => {
      http.get(`http://127.0.0.1:4123/${page}`, (res) => {
        if (res.statusCode === 200) {
          console.log(`[HTTP 200 OK] http://127.0.0.1:4123/${page}`);
        } else {
          console.error(`[HTTP ${res.statusCode}] Failed to fetch ${page}`);
          totalErrors++;
        }
        resolve();
      });
    });
  }

  server.close(() => {
    console.log(`\nVerification finished with ${totalErrors} errors.`);
    if (totalErrors > 0) process.exit(1);
    else {
      console.log('SUCCESS: All pages and assets verified with 100% integrity!');
      process.exit(0);
    }
  });
});
