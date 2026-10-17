const fs = require('fs');
const path = require('path');

const downloads = [
  // 6 Market Asset Cards
  {
    url: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1000&q=85',
    dest: 'public/market-cards/forex-real.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=1000&q=85',
    dest: 'public/market-cards/metals-real.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1000&q=85',
    dest: 'public/market-cards/indices-real.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=85',
    dest: 'public/market-cards/commodities-real.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=85',
    dest: 'public/market-cards/shares-real.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1516245834210-c4c142787335?auto=format&fit=crop&w=1000&q=85',
    dest: 'public/market-cards/crypto-real.jpg'
  },

  // 6 Section 2 Showcase Images
  {
    url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=85',
    dest: 'public/section2-rightside-images/forex-real-showcase.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=85',
    dest: 'public/section2-rightside-images/metals-real-showcase.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=1200&q=85',
    dest: 'public/section2-rightside-images/indices-real-showcase.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1544465544-1b71aee9dfa3?auto=format&fit=crop&w=1200&q=85',
    dest: 'public/section2-rightside-images/commodities-real-showcase.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=85',
    dest: 'public/section2-rightside-images/shares-real-showcase.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&w=1200&q=85',
    dest: 'public/section2-rightside-images/crypto-real-showcase.jpg'
  },

  // Market Insights & Educational Images
  {
    url: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?auto=format&fit=crop&w=800&q=85',
    dest: 'assets/images/insight_eurusd.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1589782182703-2aaa69037b5b?auto=format&fit=crop&w=800&q=85',
    dest: 'assets/images/insight_gold.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1535320903710-d993d3d77d29?auto=format&fit=crop&w=800&q=85',
    dest: 'assets/images/insight_strategy.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=85',
    dest: 'assets/images/education/article-candlestick.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=85',
    dest: 'assets/images/education/article-risk.jpg'
  }
];

async function downloadAll() {
  for (const item of downloads) {
    const fullPath = path.resolve(__dirname, '..', item.dest);
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    try {
      console.log(`Downloading ${item.dest}...`);
      const res = await fetch(item.url);
      if (!res.ok) {
        console.error(`  Failed: HTTP ${res.status}`);
        continue;
      }
      const buffer = await res.arrayBuffer();
      fs.writeFileSync(fullPath, Buffer.from(buffer));
      console.log(`  Saved ${item.dest} (${(buffer.byteLength / 1024).toFixed(1)} KB)`);
    } catch (e) {
      console.error(`  Error downloading ${item.dest}:`, e.message);
    }
  }
}

downloadAll();
