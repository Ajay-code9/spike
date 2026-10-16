/**
 * SPIKE BROKERAGE - LIVE SPREADS & CONTRACT SPECS SCRIPT
 * Real-time terminal with category filtering, search, micro-ticks, and interactive trading calculator
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. INSTRUMENTS DATA REPOSITORY
  const instruments = [
    // Forex
    { symbol: 'EUR/USD', name: 'Euro / US Dollar', category: 'forex', flag: '🇪🇺', bid: 1.0794, ask: 1.0795, rawSpread: 0.1, stdSpread: 0.8, leverage: '1:500', contractSize: '100,000 EUR', hours: '24/5', status: 'open', decimals: 4, pipValue: 10 },
    { symbol: 'GBP/USD', name: 'British Pound / US Dollar', category: 'forex', flag: '🇬🇧', bid: 1.2541, ask: 1.2543, rawSpread: 0.2, stdSpread: 0.9, leverage: '1:500', contractSize: '100,000 GBP', hours: '24/5', status: 'open', decimals: 4, pipValue: 10 },
    { symbol: 'USD/JPY', name: 'US Dollar / Japanese Yen', category: 'forex', flag: '🇯🇵', bid: 154.62, ask: 154.64, rawSpread: 0.2, stdSpread: 1.0, leverage: '1:500', contractSize: '100,000 USD', hours: '24/5', status: 'open', decimals: 2, pipValue: 6.47 },
    { symbol: 'AUD/USD', name: 'Australian Dollar / US Dollar', category: 'forex', flag: '🇦🇺', bid: 0.6521, ask: 0.6523, rawSpread: 0.2, stdSpread: 0.9, leverage: '1:500', contractSize: '100,000 AUD', hours: '24/5', status: 'open', decimals: 4, pipValue: 10 },
    { symbol: 'USD/CAD', name: 'US Dollar / Canadian Dollar', category: 'forex', flag: '🇨🇦', bid: 1.3685, ask: 1.3688, rawSpread: 0.3, stdSpread: 1.1, leverage: '1:500', contractSize: '100,000 USD', hours: '24/5', status: 'open', decimals: 4, pipValue: 7.31 },
    { symbol: 'USD/CHF', name: 'US Dollar / Swiss Franc', category: 'forex', flag: '🇨🇭', bid: 0.9124, ask: 0.9127, rawSpread: 0.3, stdSpread: 1.2, leverage: '1:500', contractSize: '100,000 USD', hours: '24/5', status: 'open', decimals: 4, pipValue: 10.96 },
    { symbol: 'EUR/GBP', name: 'Euro / British Pound', category: 'forex', flag: '🇪🇺', bid: 0.8607, ask: 0.8610, rawSpread: 0.3, stdSpread: 1.0, leverage: '1:500', contractSize: '100,000 EUR', hours: '24/5', status: 'open', decimals: 4, pipValue: 12.54 },

    // Metals
    { symbol: 'XAU/USD', name: 'Spot Gold / USD', category: 'metals', flag: '🪙', bid: 2366.82, ask: 2366.94, rawSpread: 0.12, stdSpread: 0.32, leverage: '1:200', contractSize: '100 oz', hours: '23/5', status: 'open', decimals: 2, pipValue: 10 },
    { symbol: 'XAG/USD', name: 'Spot Silver / USD', category: 'metals', flag: '🥈', bid: 31.42, ask: 31.44, rawSpread: 0.015, stdSpread: 0.035, leverage: '1:100', contractSize: '5,000 oz', hours: '23/5', status: 'open', decimals: 2, pipValue: 50 },
    { symbol: 'XPT/USD', name: 'Platinum / USD', category: 'metals', flag: '⚪', bid: 984.50, ask: 985.60, rawSpread: 1.10, stdSpread: 2.50, leverage: '1:50', contractSize: '50 oz', hours: '23/5', status: 'open', decimals: 2, pipValue: 5 },
    { symbol: 'XPD/USD', name: 'Palladium / USD', category: 'metals', flag: '🔘', bid: 1024.10, ask: 1026.20, rawSpread: 2.10, stdSpread: 4.80, leverage: '1:50', contractSize: '50 oz', hours: '23/5', status: 'open', decimals: 2, pipValue: 5 },

    // Indices
    { symbol: 'US30', name: 'Wall Street 30 (Dow)', category: 'indices', flag: '🇺🇸', bid: 38452.6, ask: 38454.2, rawSpread: 1.6, stdSpread: 2.8, leverage: '1:200', contractSize: '1 Index', hours: '24/5', status: 'open', decimals: 1, pipValue: 1 },
    { symbol: 'NAS100', name: 'US Tech 100 (Nasdaq)', category: 'indices', flag: '🇺🇸', bid: 18210.4, ask: 18211.5, rawSpread: 1.1, stdSpread: 2.0, leverage: '1:200', contractSize: '1 Index', hours: '24/5', status: 'open', decimals: 1, pipValue: 1 },
    { symbol: 'SPX500', name: 'US 500 (S&P 500)', category: 'indices', flag: '🇺🇸', bid: 5124.8, ask: 5125.2, rawSpread: 0.4, stdSpread: 0.8, leverage: '1:200', contractSize: '1 Index', hours: '24/5', status: 'open', decimals: 1, pipValue: 1 },
    { symbol: 'GER40', name: 'Germany 40 (DAX)', category: 'indices', flag: '🇩🇪', bid: 18412.0, ask: 18413.2, rawSpread: 1.2, stdSpread: 2.2, leverage: '1:200', contractSize: '1 Index', hours: 'Mon-Fri', status: 'open', decimals: 1, pipValue: 1.08 },
    { symbol: 'UK100', name: 'UK 100 (FTSE)', category: 'indices', flag: '🇬🇧', bid: 8245.5, ask: 8246.8, rawSpread: 1.3, stdSpread: 2.4, leverage: '1:200', contractSize: '1 Index', hours: 'Mon-Fri', status: 'open', decimals: 1, pipValue: 1.25 },

    // Commodities
    { symbol: 'UKOIL', name: 'Brent Crude Oil', category: 'commodities', flag: '🛢️', bid: 73.21, ask: 73.24, rawSpread: 0.03, stdSpread: 0.06, leverage: '1:100', contractSize: '1,000 Barrels', hours: '23/5', status: 'open', decimals: 2, pipValue: 10 },
    { symbol: 'USOIL', name: 'WTI Light Sweet Crude', category: 'commodities', flag: '🛢️', bid: 69.84, ask: 69.87, rawSpread: 0.03, stdSpread: 0.06, leverage: '1:100', contractSize: '1,000 Barrels', hours: '23/5', status: 'open', decimals: 2, pipValue: 10 },
    { symbol: 'NGAS', name: 'Natural Gas', category: 'commodities', flag: '🔥', bid: 2.415, ask: 2.422, rawSpread: 0.007, stdSpread: 0.015, leverage: '1:50', contractSize: '10,000 MMBtu', hours: '23/5', status: 'open', decimals: 3, pipValue: 10 },
    { symbol: 'COPPER', name: 'High Grade Copper', category: 'commodities', flag: '🧱', bid: 4.382, ask: 4.388, rawSpread: 0.006, stdSpread: 0.012, leverage: '1:50', contractSize: '25,000 lbs', hours: '23/5', status: 'open', decimals: 3, pipValue: 25 },

    // Shares
    { symbol: 'NVDA', name: 'NVIDIA Corporation', category: 'shares', flag: '🟢', bid: 124.50, ask: 124.55, rawSpread: 0.05, stdSpread: 0.15, leverage: '1:20', contractSize: '1 Share', hours: '09:30-16:00 EST', status: 'open', decimals: 2, pipValue: 1 },
    { symbol: 'AAPL', name: 'Apple Inc.', category: 'shares', flag: '🍎', bid: 187.32, ask: 187.36, rawSpread: 0.04, stdSpread: 0.12, leverage: '1:20', contractSize: '1 Share', hours: '09:30-16:00 EST', status: 'open', decimals: 2, pipValue: 1 },
    { symbol: 'MSFT', name: 'Microsoft Corporation', category: 'shares', flag: '💻', bid: 442.15, ask: 442.24, rawSpread: 0.09, stdSpread: 0.25, leverage: '1:20', contractSize: '1 Share', hours: '09:30-16:00 EST', status: 'open', decimals: 2, pipValue: 1 },
    { symbol: 'TSLA', name: 'Tesla Inc.', category: 'shares', flag: '⚡', bid: 218.40, ask: 218.52, rawSpread: 0.12, stdSpread: 0.35, leverage: '1:20', contractSize: '1 Share', hours: '09:30-16:00 EST', status: 'open', decimals: 2, pipValue: 1 },

    // Cryptocurrencies
    { symbol: 'BTC/USD', name: 'Bitcoin / US Dollar', category: 'crypto', flag: '₿', bid: 67421.5, ask: 67428.0, rawSpread: 6.5, stdSpread: 22.0, leverage: '1:50', contractSize: '1 Coin', hours: '24/7/365', status: 'open', decimals: 1, pipValue: 1 },
    { symbol: 'ETH/USD', name: 'Ethereum / US Dollar', category: 'crypto', flag: 'Ξ', bid: 3584.2, ask: 3585.4, rawSpread: 1.2, stdSpread: 3.5, leverage: '1:50', contractSize: '1 Coin', hours: '24/7/365', status: 'open', decimals: 1, pipValue: 1 },
    { symbol: 'SOL/USD', name: 'Solana / US Dollar', category: 'crypto', flag: '🟣', bid: 168.45, ask: 168.65, rawSpread: 0.20, stdSpread: 0.65, leverage: '1:33', contractSize: '1 Coin', hours: '24/7/365', status: 'open', decimals: 2, pipValue: 1 },
    { symbol: 'XRP/USD', name: 'Ripple / US Dollar', category: 'crypto', flag: '✕', bid: 0.5420, ask: 0.5424, rawSpread: 0.0004, stdSpread: 0.0012, leverage: '1:20', contractSize: '1 Coin', hours: '24/7/365', status: 'open', decimals: 4, pipValue: 1 }
  ];

  // 2. LIVE SPECS TERMINAL
  const tableBody = document.getElementById('spreadsLiveTableBody');
  const searchInput = document.getElementById('spreadsSearchInput');
  const filterPills = document.querySelectorAll('.spread-cat-pill');

  let activeCategory = 'all';
  let searchQuery = '';

  function renderSpreadsTable() {
    if (!tableBody) return;

    const filtered = instruments.filter(item => {
      const matchCat = (activeCategory === 'all' || item.category === activeCategory);
      const matchSearch = item.symbol.toLowerCase().includes(searchQuery) ||
                          item.name.toLowerCase().includes(searchQuery) ||
                          item.category.toLowerCase().includes(searchQuery);
      return matchCat && matchSearch;
    });

    if (filtered.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 36px; color: #94A3B8;">No instruments matching "${searchQuery}".</td></tr>`;
      return;
    }

    tableBody.innerHTML = filtered.map(item => `
      <tr data-symbol="${item.symbol}">
        <td>
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 1.2rem;">${item.flag}</span>
            <div>
              <strong style="color: #FFFFFF; font-size: 0.92rem; display: block;">${item.symbol}</strong>
              <span style="font-size: 0.74rem; color: #64748B;">${item.name}</span>
            </div>
          </div>
        </td>
        <td class="cell-bid" style="font-family: var(--font-mono); font-weight: 700; color: #00C087;">
          ${item.bid.toLocaleString('en-US', { minimumFractionDigits: item.decimals })}
        </td>
        <td class="cell-ask" style="font-family: var(--font-mono); font-weight: 700; color: #CBD5E1;">
          ${item.ask.toLocaleString('en-US', { minimumFractionDigits: item.decimals })}
        </td>
        <td>
          <span class="spread-badge-raw">${item.rawSpread.toFixed(item.decimals > 2 ? 2 : 1)}</span>
        </td>
        <td>
          <span class="spread-badge-std">${item.stdSpread.toFixed(item.decimals > 2 ? 2 : 1)}</span>
        </td>
        <td style="font-family: var(--font-mono); font-size: 0.85rem; color: #CBD5E1;">
          ${item.leverage}
        </td>
        <td>
          <span class="status-indicator-live ${item.status}">
            ${item.status === 'open' ? 'Live Open' : 'Closed'}
          </span>
        </td>
        <td>
          <button class="btn btn-gold btn-sm" onclick="document.getElementById('accountModal').classList.add('active');">
            Trade &rarr;
          </button>
        </td>
      </tr>
    `).join('');
  }

  // Filter pills
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeCategory = pill.dataset.category;
      renderSpreadsTable();
    });
  });

  // Search input
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      renderSpreadsTable();
    });
  }

  // Micro-fluctuations simulator
  setInterval(() => {
    const randomIdx = Math.floor(Math.random() * instruments.length);
    const inst = instruments[randomIdx];
    const row = document.querySelector(`tr[data-symbol="${inst.symbol}"]`);
    if (!row) return;

    const delta = (Math.random() - 0.49) * (inst.bid * 0.00015);
    inst.bid += delta;
    inst.ask = inst.bid + (inst.rawSpread * (inst.decimals === 4 ? 0.0001 : 0.01));

    const bidCell = row.querySelector('.cell-bid');
    const askCell = row.querySelector('.cell-ask');
    if (bidCell && askCell) {
      bidCell.textContent = inst.bid.toLocaleString('en-US', { minimumFractionDigits: inst.decimals, maximumFractionDigits: inst.decimals });
      askCell.textContent = inst.ask.toLocaleString('en-US', { minimumFractionDigits: inst.decimals, maximumFractionDigits: inst.decimals });
      bidCell.style.color = delta >= 0 ? '#00C087' : '#F43F5E';
      setTimeout(() => {
        if (bidCell) bidCell.style.color = '#00C087';
      }, 900);
    }
  }, 2400);

  // Initial table render
  renderSpreadsTable();

  // 3. INTERACTIVE TRADING COST & PIP CALCULATOR
  const calcInstrumentSelect = document.getElementById('calcInstrument');
  const calcAccountType = document.getElementById('calcAccountType');
  const calcCurrency = document.getElementById('calcCurrency');
  const calcLotsInput = document.getElementById('calcLots');
  const calcLotsSlider = document.getElementById('calcLotsSlider');
  const calcLeverage = document.getElementById('calcLeverage');

  // Outputs
  const outPipValue = document.getElementById('calcOutPipValue');
  const outSpreadCost = document.getElementById('calcOutSpreadCost');
  const outCommission = document.getElementById('calcOutCommission');
  const outMargin = document.getElementById('calcOutMargin');
  const outNotional = document.getElementById('calcOutNotional');
  const outSavings = document.getElementById('calcOutSavings');

  function calculateTradingCosts() {
    if (!calcInstrumentSelect || !calcLotsInput) return;

    const selectedSymbol = calcInstrumentSelect.value;
    const inst = instruments.find(i => i.symbol === selectedSymbol) || instruments[0];
    const lots = parseFloat(calcLotsInput.value) || 1.0;
    const isRaw = calcAccountType ? calcAccountType.value === 'raw' : true;
    const lev = parseFloat(calcLeverage ? calcLeverage.value : 500) || 500;

    // Calculations
    const pipVal = inst.pipValue * lots;
    const activeSpread = isRaw ? inst.rawSpread : inst.stdSpread;
    const spreadCost = activeSpread * pipVal;
    const commission = isRaw ? (7.0 * lots) : 0.0;
    
    // Notional & Margin
    let notional = 0;
    if (inst.category === 'forex') {
      notional = lots * 100000 * inst.bid;
    } else if (inst.symbol === 'XAU/USD') {
      notional = lots * 100 * inst.bid;
    } else if (inst.symbol === 'US30') {
      notional = lots * 1 * inst.bid;
    } else if (inst.symbol === 'BTC/USD') {
      notional = lots * 1 * inst.bid;
    } else {
      notional = lots * 100 * inst.bid;
    }
    const marginReq = notional / lev;

    // Savings on Raw vs Standard:
    const stdCost = (inst.stdSpread * pipVal);
    const rawCost = (inst.rawSpread * pipVal) + (7.0 * lots);
    const savings = Math.max(0, stdCost - rawCost);

    // Update UI
    if (outPipValue) outPipValue.textContent = `$${pipVal.toFixed(2)}`;
    if (outSpreadCost) outSpreadCost.textContent = `$${spreadCost.toFixed(2)}`;
    if (outCommission) outCommission.textContent = `$${commission.toFixed(2)}`;
    if (outMargin) outMargin.textContent = `$${marginReq.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (outNotional) outNotional.textContent = `$${notional.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (outSavings) outSavings.textContent = isRaw ? `With SPIKE Raw ECN, you save approximately $${savings.toFixed(2)} in trading friction on this single order!` : `Switch to Raw ECN to reduce spread markup down to 0.0 pips!`;
  }

  // Slider & Number Input Sync
  if (calcLotsInput && calcLotsSlider) {
    calcLotsInput.addEventListener('input', (e) => {
      calcLotsSlider.value = e.target.value;
      calculateTradingCosts();
    });
    calcLotsSlider.addEventListener('input', (e) => {
      calcLotsInput.value = e.target.value;
      calculateTradingCosts();
    });
  }

  if (calcInstrumentSelect) calcInstrumentSelect.addEventListener('change', calculateTradingCosts);
  if (calcAccountType) calcAccountType.addEventListener('change', calculateTradingCosts);
  if (calcCurrency) calcCurrency.addEventListener('change', calculateTradingCosts);
  if (calcLeverage) calcLeverage.addEventListener('change', calculateTradingCosts);

  // Initial calculation
  calculateTradingCosts();
});
