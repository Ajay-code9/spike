/**
 * Spike Brokerage - Bespoke Commodities & Energy Hero Cockpit
 * Interactive asset switcher, simulated institutional bid/ask order book & micro-ticks
 */

(function () {
  'use strict';

  const COMMODITIES_DATA = {
    usoil: {
      tag: 'NYMEX LIGHT SWEET CRUDE',
      title: 'US Crude Oil (WTI) Spot',
      basePrice: 78.42,
      changeText: '▲ +$1.08 (+1.48%)',
      isBullish: true,
      low: '$77.10',
      high: '$79.25',
      rangePercent: 62,
      spread: '0.03 PTS',
      contract: '1,000 Barrels',
      tick: '$10.00 / pt',
      leverage: '1:100 (1.0%)',
      decimals: 2,
      spreadVal: 0.03
    },
    ukoil: {
      tag: 'ICE NORTH SEA CRUDE',
      title: 'UK Brent Crude Oil Spot',
      basePrice: 82.65,
      changeText: '▲ +$0.94 (+1.15%)',
      isBullish: true,
      low: '$81.40',
      high: '$83.30',
      rangePercent: 66,
      spread: '0.04 PTS',
      contract: '1,000 Barrels',
      tick: '$10.00 / pt',
      leverage: '1:100 (1.0%)',
      decimals: 2,
      spreadVal: 0.04
    },
    ngas: {
      tag: 'HENRY HUB LIQUEFIED GAS',
      title: 'Natural Gas Futures CFD',
      basePrice: 2.482,
      changeText: '▼ -$0.06 (-2.36%)',
      isBullish: false,
      low: '$2.410',
      high: '$2.580',
      rangePercent: 42,
      spread: '0.004 PTS',
      contract: '10,000 MMBtu',
      tick: '$10.00 / pt',
      leverage: '1:50 (2.0%)',
      decimals: 3,
      spreadVal: 0.004
    },
    copper: {
      tag: 'COMEX INDUSTRIAL METALS',
      title: 'High Grade Copper CFD',
      basePrice: 4.325,
      changeText: '▲ +$0.05 (+1.17%)',
      isBullish: true,
      low: '$4.260',
      high: '$4.380',
      rangePercent: 54,
      spread: '0.004 PTS',
      contract: '25,000 lbs',
      tick: '$12.50 / pt',
      leverage: '1:100 (1.0%)',
      decimals: 3,
      spreadVal: 0.004
    }
  };

  let currentKey = 'usoil';
  let currentPrice = COMMODITIES_DATA.usoil.basePrice;
  let tickTimer = null;

  function initCockpit() {
    const tabsContainer = document.getElementById('cockpitTabs');
    if (!tabsContainer) return;

    // Tab buttons event listener
    const tabs = tabsContainer.querySelectorAll('.cockpit-tab-btn');
    tabs.forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-asset');
        if (key && COMMODITIES_DATA[key] && key !== currentKey) {
          tabs.forEach(t => t.classList.remove('active'));
          btn.classList.add('active');
          switchAsset(key);
        }
      });
    });

    renderAsset(currentKey, false);
    startMicroTicks();
  }

  function switchAsset(key) {
    currentKey = key;
    currentPrice = COMMODITIES_DATA[key].basePrice;
    renderAsset(key, true);
  }

  function renderAsset(key, didSwitch) {
    const data = COMMODITIES_DATA[key];
    if (!data) return;

    const tagEl = document.getElementById('cockpitAssetTag');
    const titleEl = document.getElementById('cockpitAssetTitle');
    const priceEl = document.getElementById('cockpitPrice');
    const changeEl = document.getElementById('cockpitChange');
    const lowEl = document.getElementById('cockpitLow');
    const highEl = document.getElementById('cockpitHigh');
    const rangeFillEl = document.getElementById('cockpitRangeFill');
    const bidEl = document.getElementById('cockpitBid');
    const askEl = document.getElementById('cockpitAsk');
    const spreadEl = document.getElementById('cockpitSpread');
    const contractEl = document.getElementById('cockpitSpecContract');
    const tickEl = document.getElementById('cockpitSpecTick');
    const leverageEl = document.getElementById('cockpitSpecLeverage');

    if (tagEl) tagEl.textContent = data.tag;
    if (titleEl) titleEl.textContent = data.title;
    if (lowEl) lowEl.textContent = data.low;
    if (highEl) highEl.textContent = data.high;
    if (spreadEl) spreadEl.textContent = data.spread;
    if (contractEl) contractEl.textContent = data.contract;
    if (tickEl) tickEl.textContent = data.tick;
    if (leverageEl) leverageEl.textContent = data.leverage;

    if (rangeFillEl) {
      rangeFillEl.style.width = `${data.rangePercent}%`;
    }

    if (changeEl) {
      changeEl.textContent = data.changeText;
      if (data.isBullish) {
        changeEl.className = 'cockpit-live-change';
      } else {
        changeEl.className = 'cockpit-live-change down';
      }
    }

    updatePriceDisplay(currentPrice, null);
  }

  function updatePriceDisplay(price, direction) {
    const data = COMMODITIES_DATA[currentKey];
    const priceEl = document.getElementById('cockpitPrice');
    const bidEl = document.getElementById('cockpitBid');
    const askEl = document.getElementById('cockpitAsk');

    const formatted = price.toFixed(data.decimals);
    const bidFormatted = (price - data.spreadVal / 2).toFixed(data.decimals);
    const askFormatted = (price + data.spreadVal / 2).toFixed(data.decimals);

    if (priceEl) {
      priceEl.textContent = `$${formatted}`;
      if (direction === 'up') {
        priceEl.classList.add('flash-up');
        setTimeout(() => priceEl.classList.remove('flash-up'), 320);
      } else if (direction === 'down') {
        priceEl.classList.add('flash-down');
        setTimeout(() => priceEl.classList.remove('flash-down'), 320);
      }
    }

    if (bidEl) bidEl.textContent = bidFormatted;
    if (askEl) askEl.textContent = askFormatted;
  }

  function startMicroTicks() {
    if (tickTimer) clearInterval(tickTimer);

    tickTimer = setInterval(() => {
      const data = COMMODITIES_DATA[currentKey];
      if (!data) return;

      // Realistic random micro jitter
      const isUp = Math.random() > 0.48;
      const stepUnit = Math.pow(10, -data.decimals);
      const delta = (Math.floor(Math.random() * 2) + 1) * stepUnit;

      if (isUp) {
        currentPrice += delta;
      } else {
        currentPrice -= delta;
      }

      // Keep within bounds
      const minP = data.basePrice * 0.985;
      const maxP = data.basePrice * 1.015;
      if (currentPrice < minP) currentPrice = minP;
      if (currentPrice > maxP) currentPrice = maxP;

      updatePriceDisplay(currentPrice, isUp ? 'up' : 'down');
    }, 2800);
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCockpit);
  } else {
    initCockpit();
  }
})();
