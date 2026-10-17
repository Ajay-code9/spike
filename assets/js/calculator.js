/**
 * SPIKE BROKERAGE - INTERACTIVE MARGIN & PIP CALCULATOR
 * Real-time institutional calculation engine
 */
(function() {
  const INSTRUMENTS = {
    'EURUSD': { name: 'EUR/USD (Euro / US Dollar)', price: 1.0842, contract: 100000, pipSize: 0.0001, spreadPips: 0.1 },
    'GBPUSD': { name: 'GBP/USD (British Pound / US Dollar)', price: 1.2985, contract: 100000, pipSize: 0.0001, spreadPips: 0.2 },
    'USDJPY': { name: 'USD/JPY (US Dollar / Japanese Yen)', price: 153.20, contract: 100000, pipSize: 0.01, spreadPips: 0.2 },
    'XAUUSD': { name: 'XAU/USD (Spot Gold Bullion)', price: 2648.50, contract: 100, pipSize: 0.01, spreadPips: 0.08 },
    'US500':  { name: 'US500 (S&P 500 Index CFD)', price: 5864.20, contract: 1, pipSize: 0.1, spreadPips: 0.4 },
    'BTCUSD': { name: 'BTC/USD (Bitcoin Spot CFD)', price: 68450.00, contract: 1, pipSize: 1.0, spreadPips: 12.0 }
  };

  let currentPair = 'EURUSD';
  let currentLeverage = 100;
  let currentLots = 1.0;

  function recalculate() {
    const inst = INSTRUMENTS[currentPair];
    if (!inst) return;

    // Margin Required = (Lots * ContractSize * Price) / Leverage
    const notional = currentLots * inst.contract * inst.price;
    const margin = notional / currentLeverage;

    // Pip Value
    let pipValue = 0;
    if (currentPair === 'EURUSD' || currentPair === 'GBPUSD') {
      pipValue = currentLots * inst.contract * inst.pipSize;
    } else if (currentPair === 'USDJPY') {
      pipValue = (currentLots * inst.contract * inst.pipSize) / inst.price;
    } else if (currentPair === 'XAUUSD') {
      pipValue = currentLots * inst.contract * 0.10; // $10 per $0.10 move on 1 lot
    } else {
      pipValue = currentLots * inst.contract * inst.pipSize;
    }

    const spreadCost = inst.spreadPips * pipValue;
    const projectedProfit = 15 * pipValue;

    // Update DOM
    const marginEl = document.getElementById('calc-res-margin');
    const pipEl = document.getElementById('calc-res-pip');
    const spreadEl = document.getElementById('calc-res-spread');
    const profitEl = document.getElementById('calc-res-profit');
    const notionalEl = document.getElementById('calc-res-notional');
    const lotBadgeEl = document.getElementById('calc-lot-badge');

    if (lotBadgeEl) lotBadgeEl.textContent = `${currentLots.toFixed(2)} Lots`;
    if (marginEl) marginEl.textContent = `$${margin.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (pipEl) pipEl.textContent = `$${pipValue.toFixed(2)}`;
    if (spreadEl) spreadEl.textContent = `$${spreadCost.toFixed(2)}`;
    if (profitEl) profitEl.textContent = `+$${projectedProfit.toFixed(2)}`;
    if (notionalEl) notionalEl.textContent = `$${notional.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  }

  window.SpikeCalc = {
    setPair: function(pair) {
      currentPair = pair;
      recalculate();
    },
    setLeverage: function(lev, btn) {
      currentLeverage = parseInt(lev, 10);
      document.querySelectorAll('.spike-calc-pill-btn').forEach(b => b.classList.remove('active'));
      if (btn) btn.classList.add('active');
      recalculate();
    },
    setLots: function(lots) {
      currentLots = parseFloat(lots);
      recalculate();
    },
    init: function() {
      recalculate();
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    const slider = document.getElementById('calc-lot-slider');
    const select = document.getElementById('calc-pair-select');
    if (slider) {
      slider.addEventListener('input', (e) => {
        window.SpikeCalc.setLots(e.target.value);
      });
    }
    if (select) {
      select.addEventListener('change', (e) => {
        window.SpikeCalc.setPair(e.target.value);
      });
    }
    recalculate();
  });
})();
