/**
 * SPIKE BROKERAGE - MARKETS INTERACTIVE SCRIPT
 * Live searching, category filtering, and micro-price fluctuations on the instrument specs table
 */

document.addEventListener('DOMContentLoaded', () => {
  const instruments = [
    { symbol: 'EUR/USD', market: 'Forex', category: 'forex', flag: '🇪🇺', bid: 1.0794, ask: 1.0796, spread: 0.2, hours: '24 hours', isUp: true, decimals: 4 },
    { symbol: 'GBP/USD', market: 'Forex', category: 'forex', flag: '🇬🇧', bid: 1.2541, ask: 1.2543, spread: 0.2, hours: '24 hours', isUp: false, decimals: 4 },
    { symbol: 'XAU/USD', market: 'Metals', category: 'metals', flag: '🪙', bid: 2366.82, ask: 2367.14, spread: 3.2, hours: '24 hours', isUp: true, decimals: 2 },
    { symbol: 'US30', market: 'Indices', category: 'indices', flag: '🇺🇸', bid: 38452.6, ask: 38455.1, spread: 2.5, hours: '24 hours', isUp: true, decimals: 1 },
    { symbol: 'UKOIL', market: 'Commodities', category: 'commodities', flag: '🛢️', bid: 73.21, ask: 73.25, spread: 4.0, hours: '24 hours', isUp: false, decimals: 2 },
    { symbol: 'AAPL', market: 'Shares', category: 'shares', flag: '🍎', bid: 187.32, ask: 187.36, spread: 4.0, hours: 'Regular hours', isUp: true, decimals: 2 },
    { symbol: 'BTC/USD', market: 'Cryptocurrencies', category: 'crypto', flag: '₿', bid: 67421.5, ask: 67458.3, spread: 36.8, hours: '24 hours', isUp: true, decimals: 1 }
  ];

  const tableBody = document.getElementById('specsTableBody');
  const searchInput = document.getElementById('specsSearchInput');
  const filterPills = document.querySelectorAll('.spec-pill-btn');

  let activeCategory = 'all';
  let searchQuery = '';

  function renderTable() {
    if (!tableBody) return;

    const filtered = instruments.filter(item => {
      const matchCat = (activeCategory === 'all' || item.category === activeCategory);
      const matchSearch = item.symbol.toLowerCase().includes(searchQuery) || item.market.toLowerCase().includes(searchQuery);
      return matchCat && matchSearch;
    });

    if (filtered.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 32px; color: #94A3B8;">No instruments matching your search.</td></tr>`;
      return;
    }

    tableBody.innerHTML = filtered.map(item => `
      <tr data-symbol="${item.symbol}">
        <td>
          <div class="spec-symbol-col">
            <span class="spec-flag-icon">${item.flag}</span>
            <strong style="color: #FFFFFF;">${item.symbol}</strong>
          </div>
        </td>
        <td>${item.market}</td>
        <td class="${item.isUp ? 'spec-price-green' : 'spec-price-red'} cell-bid">${item.bid.toLocaleString('en-US', { minimumFractionDigits: item.decimals })}</td>
        <td class="${item.isUp ? 'spec-price-green' : 'spec-price-red'} cell-ask">${item.ask.toLocaleString('en-US', { minimumFractionDigits: item.decimals })}</td>
        <td class="spec-spread-mono">${item.spread.toFixed(1)}</td>
        <td>${item.hours}</td>
        <td>
          <button class="btn btn-gold btn-sm" onclick="document.getElementById('accountModal').classList.add('active');">
            Trade &rarr;
          </button>
        </td>
      </tr>
    `).join('');
  }

  // Filter Pills click handler
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeCategory = pill.dataset.category;
      renderTable();
    });
  });

  // Search input handler
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      renderTable();
    });
  }

  // Initial render
  renderTable();

  // Micro-fluctuations simulator for market specs table
  setInterval(() => {
    const randomIdx = Math.floor(Math.random() * instruments.length);
    const inst = instruments[randomIdx];
    const row = document.querySelector(`tr[data-symbol="${inst.symbol}"]`);
    if (!row) return;

    const delta = (Math.random() - 0.49) * (inst.bid * 0.0002);
    inst.bid += delta;
    inst.ask = inst.bid + (inst.spread * (inst.decimals === 4 ? 0.0001 : 0.01));
    inst.isUp = delta >= 0;

    const bidCell = row.querySelector('.cell-bid');
    const askCell = row.querySelector('.cell-ask');
    if (bidCell && askCell) {
      bidCell.textContent = inst.bid.toLocaleString('en-US', { minimumFractionDigits: inst.decimals, maximumFractionDigits: inst.decimals });
      askCell.textContent = inst.ask.toLocaleString('en-US', { minimumFractionDigits: inst.decimals, maximumFractionDigits: inst.decimals });
      
      const newClass = inst.isUp ? 'spec-price-green' : 'spec-price-red';
      bidCell.className = `cell-bid ${newClass}`;
      askCell.className = `cell-ask ${newClass}`;
    }
  }, 2600);
});
