/**
 * SPIKE BROKERAGE - LIVE MARKET TICKER TAPE
 * Smooth continuous stream with live micro-ticks and price updates
 */
(function() {
  const DEFAULT_ITEMS = [
    { symbol: 'EUR/USD', price: 1.08425, change: '+0.14%', dir: 'up', decimals: 5, step: 0.0001, url: 'forex.html' },
    { symbol: 'XAU/USD', price: 2648.50, change: '+0.62%', dir: 'up', decimals: 2, step: 0.25, url: 'metals.html' },
    { symbol: 'US500', price: 5864.20, change: '-0.21%', dir: 'down', decimals: 2, step: 0.50, url: 'indices.html' },
    { symbol: 'GBP/USD', price: 1.29840, change: '+0.08%', dir: 'up', decimals: 5, step: 0.0001, url: 'forex.html' },
    { symbol: 'BTC/USD', price: 68450.00, change: '+2.15%', dir: 'up', decimals: 2, step: 15.0, url: 'crypto.html' },
    { symbol: 'NAS100', price: 20380.10, change: '+0.45%', dir: 'up', decimals: 2, step: 1.20, url: 'indices.html' },
    { symbol: 'USOIL', price: 74.25, change: '-0.38%', dir: 'down', decimals: 2, step: 0.05, url: 'commodities.html' },
    { symbol: 'USD/JPY', price: 153.240, change: '+0.18%', dir: 'up', decimals: 3, step: 0.02, url: 'forex.html' },
    { symbol: 'XAG/USD', price: 31.85, change: '+1.10%', dir: 'up', decimals: 2, step: 0.03, url: 'metals.html' },
    { symbol: 'ETH/USD', price: 2684.50, change: '+1.42%', dir: 'up', decimals: 2, step: 1.50, url: 'crypto.html' }
  ];

  function renderItem(item, idx, prefix) {
    const id = `${prefix}-item-${idx}`;
    return `
      <a href="${item.url}" class="spike-ticker-item" id="${id}">
        <span class="spike-ticker-symbol">${item.symbol}</span>
        <span class="spike-ticker-price" id="${id}-price">${item.price.toFixed(item.decimals)}</span>
        <span class="spike-ticker-change ${item.dir}" id="${id}-change">${item.change}</span>
      </a>
    `;
  }

  function initTicker() {
    const existing = document.querySelector('.spike-ticker-bar');
    if (existing) return;

    const bar = document.createElement('div');
    bar.className = 'spike-ticker-bar';

    const itemsHtml = DEFAULT_ITEMS.map((it, idx) => renderItem(it, idx, 't1')).join('');
    const itemsHtmlRepeat = DEFAULT_ITEMS.map((it, idx) => renderItem(it, idx, 't2')).join('');

    bar.innerHTML = `
      <div class="spike-ticker-label">
        <span class="spike-ticker-pulse"></span>
        <span>LIVE FEED</span>
      </div>
      <div class="spike-ticker-track-wrap">
        <div class="spike-ticker-track">
          ${itemsHtml}
          ${itemsHtmlRepeat}
        </div>
      </div>
    `;

    // Insert at the very top of body
    document.body.insertBefore(bar, document.body.firstChild);

    // Micro-tick random updates every 2.5s
    setInterval(() => {
      const idx = Math.floor(Math.random() * DEFAULT_ITEMS.length);
      const it = DEFAULT_ITEMS[idx];
      const delta = (Math.random() - 0.48) * it.step;
      it.price += delta;
      const isUp = delta >= 0;

      ['t1', 't2'].forEach(prefix => {
        const pEl = document.getElementById(`${prefix}-item-${idx}-price`);
        if (pEl) {
          pEl.textContent = it.price.toFixed(it.decimals);
          pEl.classList.remove('flash-up', 'flash-down');
          pEl.classList.add(isUp ? 'flash-up' : 'flash-down');
          setTimeout(() => pEl.classList.remove('flash-up', 'flash-down'), 600);
        }
      });
    }, 2200);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTicker);
  } else {
    initTicker();
  }
})();
