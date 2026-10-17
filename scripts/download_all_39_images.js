const https = require('https');
const fs = require('fs');
const path = require('path');

const TARGET_MAP = {
  // --- Homepage Cards ---
  'public/home-cards/home-card-forex.jpg': 'File:Euro Series Banknotes (2019).jpg',
  'public/home-cards/home-card-crypto.jpg': 'File:Close-up of a physical Ethereum coin (51002904687).jpg',
  
  // --- Homepage Insights ---
  'public/insights/home-insight-eurusd.jpg': 'File:Bundza penazi money Euro banknotes.jpg',
  'public/insights/home-insight-gold.jpg': 'File:1 oz Krugerrand 2017 Bildseite.png',
  'public/insights/home-insight-strategy.jpg': 'File:Michael Ligon Stock Market Conference 2023.png',

  // --- Showcases ---
  'public/showcases/forex-showcase.jpg': 'File:Bank of England Building, London, UK - Diliff.jpg',
  'public/showcases/metals-showcase.jpg': 'File:Gold ingot and bar of Banque de France.jpg',
  'public/showcases/indices-showcase.jpg': 'File:Nasdaq Tower May 2026.jpg',
  'public/showcases/commodities-showcase.jpg': 'File:Blue hour fog over Preemraff oil refinery by Brofjorden.jpg',
  'public/showcases/crypto-showcase.jpg': 'File:Wikimedia Foundation Servers-8055 35.jpg',

  // --- Forex Articles ---
  'public/articles/forex-art-pairs.jpg': 'File:All Euro banknotes.png',
  'public/articles/forex-art-sessions.jpg': 'File:Big Ben Elizabeth Tower London 2023 01.jpg',
  'public/articles/forex-art-risk.jpg': 'File:Currency exchange machine.jpg',

  // --- Metals Articles ---
  'public/articles/metals-art-correlation.jpg': 'File:Gold Ingots on white background.jpg',
  'public/articles/metals-art-goldanalysis.jpg': 'File:Bullion Gold bar at Swiss Money Museum (Ank Kumar, Infosys).jpg',
  'public/articles/metals-art-silver.jpg': 'File:Scottsdale Mint 100 Troy Ounce Silver Bar.jpg',

  // --- Indices Articles ---
  'public/articles/indices-art-tech.jpg': 'File:Intel SB80486DX2-50.jpg',
  'public/articles/indices-art-futures.jpg': 'File:Chicago.Mercantile.Exchange.jpg',
  'public/articles/indices-art-openbell.jpg': 'File:Bull Wall Street (6173547669).jpg',

  // --- Commodities Articles ---
  'public/articles/commodities-art-opec.jpg': 'File:Sinclair Oil Refinery Storage Tanks - Wyoming.jpg',
  'public/articles/commodities-art-natgas.jpg': 'File:2023-05-20 02 LNG tanker, GULF ENERGY - IMO 7390143.jpg',
  'public/articles/commodities-art-agri.jpg': 'File:Combine in wheat field.jpg',

  // --- Shares Articles ---
  'public/articles/shares-art-earnings.jpg': 'File:Frankfurt Stock Exchange (Ank Kumar) 02.jpg',
  'public/articles/shares-art-sectors.jpg': 'File:New York Stock Exchange August 2017 02.jpg',
  'public/articles/shares-art-dividends.jpg': 'File:Market data on display at Taiwan Stock Exchange 20210208.jpg',

  // --- Crypto Articles ---
  'public/articles/crypto-art-halving.jpg': 'File:Cryptocurrency mining machine.jpg',
  'public/articles/crypto-art-volatility.jpg': 'File:Physical bitcoin statistic coin.JPG',
  'public/articles/crypto-art-ethereum.jpg': 'File:Cryptocurrency (38747838010).jpg',

  // --- Analysis Articles ---
  'public/articles/analysis-art-gold.jpg': 'File:Krugerrand 1oz 2017 obverse.jpg',
  'public/articles/analysis-art-ecb.jpg': 'File:Seat of the European Central Bank and Frankfurt Skyline at dawn 20150422 1.jpg',
  'public/articles/analysis-art-nasdaq.jpg': 'File:NASDAQ Times Square - panoramio.jpg',

  // --- Video Course Thumbnails ---
  'public/articles/video-course-candlesticks.jpg': 'File:Price Candlestick Charts (US$) and SMA(50).png',
  'public/articles/video-course-liquidity.jpg': 'File:Day of stock price changes.png',
  'public/articles/video-course-goldplaybook.jpg': 'File:Gold bullion bars.jpg',
  'public/articles/video-course-forexconfluence.jpg': 'File:Room in old Chicago Board of Trade Building.jpg',
  'public/articles/video-course-marketopen.jpg': 'File:Wall Street - New York Stock Exchange.jpg',
  'public/articles/video-course-algo.jpg': 'File:Algorithmic Trading. Percentage of Market Volume.png',
  'public/articles/video-course-risk.jpg': 'File:AlgoSrategies.jpg',
  'public/articles/video-course-psychology.jpg': 'File:CharlesBiderman2007.jpg'
};

function downloadUrl(url, dest) {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(dest);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    https.get(url, { headers: { 'User-Agent': 'SpikeTradingWeb/1.0 (contact@spike.com)' } }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadUrl(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) return reject(new Error('HTTP ' + res.statusCode));
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close(() => {
          const stats = fs.statSync(dest);
          resolve(stats.size);
        });
      });
    }).on('error', reject);
  });
}

async function run() {
  const titles = Object.values(TARGET_MAP);
  const chunks = [];
  for (let i = 0; i < titles.length; i += 20) {
    chunks.push(titles.slice(i, i + 20));
  }

  const urlMap = {};

  for (const chunk of chunks) {
    const url = 'https://commons.wikimedia.org/w/api.php?action=query&titles=' + encodeURIComponent(chunk.join('|')) + '&prop=imageinfo&iiprop=url&iiurlwidth=900&format=json';
    await new Promise((resolve) => {
      https.get(url, { headers: { 'User-Agent': 'SpikeTradingWeb/1.0 (contact@spike.com)' } }, res => {
        let data = '';
        res.on('data', c => data += c);
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            Object.values(json.query.pages).forEach(p => {
              const ii = p.imageinfo && p.imageinfo[0];
              urlMap[p.title] = ii ? (ii.thumburl || ii.url) : null;
            });
          } catch(e) {}
          resolve();
        });
      }).on('error', () => resolve());
    });
  }

  console.log(`Starting download of ${Object.keys(TARGET_MAP).length} verified unique images...`);
  let count = 0;

  for (const [dest, title] of Object.entries(TARGET_MAP)) {
    const u = urlMap[title];
    if (!u) {
      console.error(`❌ Missing URL for ${title}`);
      continue;
    }
    try {
      const size = await downloadUrl(u, dest);
      count++;
      console.log(`[${count}/${Object.keys(TARGET_MAP).length}] ✅ Saved ${dest} (${Math.round(size / 1024)} KB)`);
    } catch (err) {
      console.error(`❌ Download failed for ${dest}: ${err.message}`);
    }
  }

  console.log(`\nSuccessfully downloaded ${count} unique files.`);
}

run();
