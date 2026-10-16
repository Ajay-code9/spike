/**
 * SPIKE BROKERAGE - MARKETS OVERVIEW SCRIPT
 * Live global session clocks, macro correlation terminal, search, and price updates
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. LIVE GLOBAL TRADING SESSION CLOCKS
  function updateSessionClocks() {
    const now = new Date();

    const sessions = [
      { id: 'london', tz: 'Europe/London', openHour: 8, closeHour: 16 },
      { id: 'newyork', tz: 'America/New_York', openHour: 9.5, closeHour: 16 },
      { id: 'tokyo', tz: 'Asia/Tokyo', openHour: 9, closeHour: 15 },
      { id: 'sydney', tz: 'Australia/Sydney', openHour: 10, closeHour: 16 }
    ];

    sessions.forEach(sess => {
      const timeElem = document.getElementById(`clockTime-${sess.id}`);
      const pillElem = document.getElementById(`clockPill-${sess.id}`);
      if (!timeElem) return;

      try {
        const timeStr = now.toLocaleTimeString('en-US', {
          timeZone: sess.tz,
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });
        timeElem.textContent = timeStr;

        // Calculate hours in target timezone
        const hourParts = timeStr.split(':');
        const currHour = parseInt(hourParts[0], 10) + (parseInt(hourParts[1], 10) / 60);

        // Check if market open
        const dayOfWeek = new Date(now.toLocaleString('en-US', { timeZone: sess.tz })).getDay();
        const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);

        if (pillElem) {
          if (!isWeekend && currHour >= sess.openHour && currHour <= sess.closeHour) {
            pillElem.className = 'clock-status-pill open';
            pillElem.textContent = 'Session Open';
          } else {
            pillElem.className = 'clock-status-pill closed';
            pillElem.textContent = 'Closed';
          }
        }
      } catch (e) {
        console.error('Timezone error', e);
      }
    });
  }

  setInterval(updateSessionClocks, 1000);
  updateSessionClocks();

  // 2. MACRO CORRELATION TERMINAL TABS
  const macroTabs = document.querySelectorAll('.macro-tab-btn');
  const macroPanels = document.querySelectorAll('.macro-tab-panel');

  macroTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.dataset.macroTarget;

      macroTabs.forEach(t => t.classList.remove('active'));
      macroPanels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) targetPanel.classList.add('active');
    });
  });

  // 3. INSTRUMENTS SPECS TABLE (Overview Section)
  const instruments = [
    { symbol: 'EUR/USD', market: 'Forex', category: 'forex', flag: '🇪🇺', bid: 1.0794, ask: 1.0795, spread: 0.1, hours: '24/5', isUp: true, decimals: 4 },
    { symbol: 'GBP/USD', market: 'Forex', category: 'forex', flag: '🇬🇧', bid: 1.2541, ask: 1.2543, spread: 0.2, hours: '24/5', isUp: false, decimals: 4 },
    { symbol: 'XAU/USD', market: 'Metals', category: 'metals', flag: '🪙', bid: 2366.82, ask: 2366.94, spread: 0.12, hours: '23/5', isUp: true, decimals: 2 },
    { symbol: 'US30', market: 'Indices', category: 'indices', flag: '🇺🇸', bid: 38452.6, ask: 38454.2, spread: 1.6, hours: '24/5', isUp: true, decimals: 1 },
    { symbol: 'UKOIL', market: 'Commodities', category: 'commodities', flag: '🛢️', bid: 73.21, ask: 73.24, spread: 0.03, hours: '23/5', isUp: false, decimals: 2 },
    { symbol: 'NVDA', market: 'Shares', category: 'shares', flag: '🟢', bid: 124.50, ask: 124.55, spread: 0.05, hours: 'US Hours', isUp: true, decimals: 2 },
    { symbol: 'BTC/USD', market: 'Cryptocurrencies', category: 'crypto', flag: '₿', bid: 67421.5, ask: 67428.0, spread: 6.5, hours: '24/7/365', isUp: true, decimals: 1 }
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
        <td class="spec-spread-mono">${item.spread.toFixed(item.decimals > 2 ? 2 : 1)}</td>
        <td>${item.hours}</td>
        <td>
          <button class="btn btn-gold btn-sm" onclick="document.getElementById('accountModal').classList.add('active');">
            Trade &rarr;
          </button>
        </td>
      </tr>
    `).join('');
  }

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeCategory = pill.dataset.category;
      renderTable();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      renderTable();
    });
  }

  renderTable();

  // Micro-fluctuations simulator
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
