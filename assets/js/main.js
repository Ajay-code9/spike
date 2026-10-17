/**
 * SPIKE BROKERAGE - MAIN SCRIPTS
 * Global interactive handlers, real-time ticker animation, modal dialogs, and navigation
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileNav();
  initModals();
  initLiveTicker();
  initSmoothScroll();
});

/* Sticky Header on Scroll */
function initStickyHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* Mobile Navigation Toggle */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (!toggleBtn || !navMenu) return;

  function closeMenu() {
    navMenu.classList.remove('open');
    toggleBtn.classList.remove('active');
    document.body.style.overflow = '';
  }

  function openMenu() {
    navMenu.classList.add('open');
    toggleBtn.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (navMenu.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Handle dropdown accordions on mobile
  navMenu.querySelectorAll('.nav-item').forEach(item => {
    const link = item.querySelector('.nav-link');
    const dropdown = item.querySelector('.dropdown-menu');
    if (dropdown && link) {
      link.addEventListener('click', (e) => {
        if (window.innerWidth <= 860) {
          e.preventDefault();
          e.stopPropagation();
          item.classList.toggle('open');
        }
      });
    } else if (link) {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 860) {
          closeMenu();
        }
      });
    }
  });

  // Dropdown item links navigate and close menu
  navMenu.querySelectorAll('.dropdown-link').forEach(dLink => {
    dLink.addEventListener('click', () => {
      if (window.innerWidth <= 860) {
        closeMenu();
      }
    });
  });

  // Inject mobile CTA at the bottom if not present
  if (!navMenu.querySelector('.nav-menu-mobile-actions')) {
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'nav-menu-mobile-actions';
    actionsDiv.innerHTML = `
      <a href="#" class="btn btn-gold btn-block" data-open-modal="account">Open Live Account</a>
      <div class="mobile-menu-meta">
        <span>Raw Spreads from 0.0 Pips</span>
        <span>•</span>
        <span>24/7 Support</span>
      </div>
    `;
    navMenu.appendChild(actionsDiv);
  }

  // Close when clicking outside menu
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 860 && navMenu.classList.contains('open')) {
      if (!navMenu.contains(e.target) && !toggleBtn.contains(e.target)) {
        closeMenu();
      }
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      closeMenu();
    }
  });

  // Close on window resize to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 860 && navMenu.classList.contains('open')) {
      closeMenu();
    }
  });
}

/* Modal Controllers (Search, Login, Open Account) */
function initModals() {
  // Modal targets
  const loginModal = document.getElementById('loginModal');
  const accountModal = document.getElementById('accountModal');
  const searchModal = document.getElementById('searchModal');

  function closeMobileNavIfOpen() {
    const navMenu = document.querySelector('.nav-menu');
    const toggleBtn = document.querySelector('.mobile-toggle');
    if (navMenu && navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
      if (toggleBtn) toggleBtn.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // Trigger buttons
  document.querySelectorAll('[data-open-modal="login"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      closeMobileNavIfOpen();
      openModal(loginModal);
    });
  });

  document.querySelectorAll('[data-open-modal="account"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      closeMobileNavIfOpen();
      openModal(accountModal);
    });
  });

  document.querySelectorAll('[data-open-modal="search"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(searchModal);
    });
  });

  // Close handlers
  document.querySelectorAll('.modal-backdrop').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.closest('.modal-close-btn')) {
        closeModal(modal);
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-backdrop.active').forEach(closeModal);
    }
  });
}

function openModal(modal) {
  if (!modal) return;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

/* Live Market Ticker with Multi-Category Switching & Micro-Fluctuations */
function initLiveTicker() {
  const tickerGrid = document.querySelector('.ticker-grid');
  const catBtns = document.querySelectorAll('.ticker-cat-btn');
  if (!tickerGrid || !catBtns.length) return;

  const marketCategories = {
    popular: [
      { id: 'eurusd', symbol: 'EUR/USD', basePrice: 1.0794, decimals: 4, changeVal: 0.0017, changePct: 0.16, isBullish: true, spread: '0.0 pips', link: 'forex.html', points: '0,18 12,16 24,19 36,12 48,14 60,6' },
      { id: 'gbpusd', symbol: 'GBP/USD', basePrice: 1.2540, decimals: 4, changeVal: -0.0025, changePct: -0.20, isBullish: false, spread: '0.2 pips', link: 'forex.html', points: '0,8 14,11 28,9 42,16 52,14 60,20' },
      { id: 'xauusd', symbol: 'XAU/USD', basePrice: 2366.58, decimals: 2, changeVal: 12.15, changePct: 0.52, isBullish: true, spread: '0.12 pts', link: 'metals.html', points: '0,20 15,17 30,12 42,14 52,8 60,4' },
      { id: 'us30', symbol: 'US30', basePrice: 38453.5, decimals: 1, changeVal: 101.4, changePct: 0.26, isBullish: true, spread: '1.0 pt', link: 'indices.html', points: '0,16 12,18 26,14 38,10 50,12 60,5' },
      { id: 'btcusd', symbol: 'BTC/USD', basePrice: 67421.5, decimals: 1, changeVal: 1121.3, changePct: 1.69, isBullish: true, spread: '$12.0', link: 'crypto.html', points: '0,21 14,18 28,15 40,8 50,11 60,3' }
    ],
    forex: [
      { id: 'eurusd', symbol: 'EUR/USD', basePrice: 1.0794, decimals: 4, changeVal: 0.0017, changePct: 0.16, isBullish: true, spread: '0.0 pips', link: 'forex.html', points: '0,18 12,16 24,19 36,12 48,14 60,6' },
      { id: 'gbpusd', symbol: 'GBP/USD', basePrice: 1.2540, decimals: 4, changeVal: -0.0025, changePct: -0.20, isBullish: false, spread: '0.2 pips', link: 'forex.html', points: '0,8 14,11 28,9 42,16 52,14 60,20' },
      { id: 'usdjpy', symbol: 'USD/JPY', basePrice: 154.280, decimals: 3, changeVal: 0.540, changePct: 0.35, isBullish: true, spread: '0.1 pips', link: 'forex.html', points: '0,19 12,17 26,13 38,15 50,9 60,4' },
      { id: 'audusd', symbol: 'AUD/USD', basePrice: 0.6582, decimals: 4, changeVal: -0.0009, changePct: -0.14, isBullish: false, spread: '0.2 pips', link: 'forex.html', points: '0,7 15,10 30,14 42,12 52,18 60,21' },
      { id: 'usdcad', symbol: 'USD/CAD', basePrice: 1.3685, decimals: 4, changeVal: 0.0015, changePct: 0.11, isBullish: true, spread: '0.3 pips', link: 'forex.html', points: '0,17 14,15 28,18 40,11 50,12 60,5' }
    ],
    metals: [
      { id: 'xauusd', symbol: 'XAU/USD', basePrice: 2366.58, decimals: 2, changeVal: 12.15, changePct: 0.52, isBullish: true, spread: '0.12 pts', link: 'metals.html', points: '0,20 15,17 30,12 42,14 52,8 60,4' },
      { id: 'xagusd', symbol: 'XAG/USD', basePrice: 28.452, decimals: 3, changeVal: 0.332, changePct: 1.18, isBullish: true, spread: '0.015', link: 'metals.html', points: '0,22 14,19 28,14 40,11 50,7 60,2' },
      { id: 'xptusd', symbol: 'XPT/USD', basePrice: 982.40, decimals: 2, changeVal: -4.15, changePct: -0.42, isBullish: false, spread: '1.2 pts', link: 'metals.html', points: '0,6 14,10 28,8 42,15 52,13 60,19' },
      { id: 'xpdusd', symbol: 'XPD/USD', basePrice: 1024.10, decimals: 2, changeVal: 8.60, changePct: 0.85, isBullish: true, spread: '2.0 pts', link: 'metals.html', points: '0,18 15,16 30,11 44,13 54,7 60,4' },
      { id: 'copper', symbol: 'COPPER', basePrice: 4.4820, decimals: 4, changeVal: 0.0285, changePct: 0.64, isBullish: true, spread: '0.002', link: 'metals.html', points: '0,19 14,18 28,13 40,15 52,9 60,3' }
    ],
    commodities: [
      { id: 'usoil', symbol: 'USOIL', basePrice: 82.45, decimals: 2, changeVal: -0.65, changePct: -0.78, isBullish: false, spread: '0.03 pts', link: 'commodities.html', points: '0,7 14,9 28,14 42,12 52,17 60,20' },
      { id: 'ukoil', symbol: 'UKOIL', basePrice: 86.92, decimals: 2, changeVal: -0.57, changePct: -0.65, isBullish: false, spread: '0.03 pts', link: 'commodities.html', points: '0,8 15,11 30,15 44,13 54,18 60,21' },
      { id: 'ngas', symbol: 'NGAS', basePrice: 2.145, decimals: 3, changeVal: 0.051, changePct: 2.45, isBullish: true, spread: '0.008', link: 'commodities.html', points: '0,21 12,18 26,11 38,13 50,6 60,2' },
      { id: 'coffee', symbol: 'COFFEE', basePrice: 224.80, decimals: 2, changeVal: 2.95, changePct: 1.34, isBullish: true, spread: '0.15', link: 'commodities.html', points: '0,19 14,16 28,12 40,14 52,7 60,3' },
      { id: 'wheat', symbol: 'WHEAT', basePrice: 584.25, decimals: 2, changeVal: -2.25, changePct: -0.38, isBullish: false, spread: '0.25', link: 'commodities.html', points: '0,9 15,11 28,8 42,16 52,14 60,19' }
    ],
    shares: [
      { id: 'nvda', symbol: 'NVDA', basePrice: 128.40, decimals: 2, changeVal: 3.55, changePct: 2.85, isBullish: true, spread: '$0.02', link: 'shares.html', points: '0,22 14,17 28,12 40,15 50,7 60,2' },
      { id: 'aapl', symbol: 'AAPL', basePrice: 189.65, decimals: 2, changeVal: 1.35, changePct: 0.72, isBullish: true, spread: '$0.01', link: 'shares.html', points: '0,18 15,16 30,13 42,11 52,8 60,4' },
      { id: 'tsla', symbol: 'TSLA', basePrice: 178.20, decimals: 2, changeVal: -2.62, changePct: -1.45, isBullish: false, spread: '$0.03', link: 'shares.html', points: '0,6 14,9 28,13 42,11 52,17 60,21' },
      { id: 'msft', symbol: 'MSFT', basePrice: 448.50, decimals: 2, changeVal: 4.18, changePct: 0.94, isBullish: true, spread: '$0.02', link: 'shares.html', points: '0,19 14,17 28,14 40,10 50,9 60,3' },
      { id: 'amzn', symbol: 'AMZN', basePrice: 184.30, decimals: 2, changeVal: 2.04, changePct: 1.12, isBullish: true, spread: '$0.02', link: 'shares.html', points: '0,20 15,18 30,12 42,14 52,7 60,4' }
    ],
    cryptocurrencies: [
      { id: 'btcusd', symbol: 'BTC/USD', basePrice: 67421.5, decimals: 1, changeVal: 1121.3, changePct: 1.69, isBullish: true, spread: '$12.0', link: 'crypto.html', points: '0,21 14,18 28,15 40,8 50,11 60,3' },
      { id: 'ethusd', symbol: 'ETH/USD', basePrice: 3542.80, decimals: 2, changeVal: 74.20, changePct: 2.14, isBullish: true, spread: '$0.85', link: 'crypto.html', points: '0,20 12,17 26,12 38,9 50,6 60,2' },
      { id: 'solusd', symbol: 'SOL/USD', basePrice: 154.20, decimals: 2, changeVal: 7.15, changePct: 4.85, isBullish: true, spread: '$0.08', link: 'crypto.html', points: '0,22 14,16 28,10 40,12 52,5 60,1' },
      { id: 'bnbusd', symbol: 'BNB/USD', basePrice: 594.10, decimals: 2, changeVal: 2.85, changePct: 0.48, isBullish: true, spread: '$0.20', link: 'crypto.html', points: '0,18 15,16 30,13 42,12 52,9 60,5' },
      { id: 'xrpusd', symbol: 'XRP/USD', basePrice: 0.5284, decimals: 4, changeVal: -0.0045, changePct: -0.85, isBullish: false, spread: '0.0002', link: 'crypto.html', points: '0,8 14,12 28,10 42,17 52,15 60,21' }
    ]
  };

  let currentCategory = 'popular';
  let activeItems = [...marketCategories.popular];

  function formatNumber(num, decimals) {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  }

  function renderCards(categoryKey) {
    const items = marketCategories[categoryKey] || marketCategories.popular;
    activeItems = items;
    currentCategory = categoryKey;

    tickerGrid.classList.add('is-switching');

    setTimeout(() => {
      tickerGrid.innerHTML = items.map(item => {
        const changeSign = item.changeVal >= 0 ? '+' : '';
        const pctSign = item.changePct >= 0 ? '+' : '';
        const strokeColor = item.isBullish ? '#00C087' : '#F43F5E';
        const changeClass = item.isBullish ? 'bullish' : 'bearish';

        return `
          <a href="${item.link}" class="ticker-card" data-ticker-id="${item.id}" title="Trade ${item.symbol}">
            <div>
              <div class="ticker-symbol">
                <span>${item.symbol}</span>
                <span class="ticker-spread-tag">${item.spread}</span>
              </div>
              <div class="ticker-price">${formatNumber(item.basePrice, item.decimals)}</div>
              <div class="ticker-change ${changeClass}">
                ${changeSign}${item.changeVal.toFixed(item.decimals > 2 ? 4 : item.decimals)} (${pctSign}${item.changePct.toFixed(2)}%)
              </div>
            </div>
            <svg class="sparkline-svg" viewBox="0 0 60 24">
              <polyline fill="none" stroke="${strokeColor}" stroke-width="1.8" points="${item.points}" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </a>
        `;
      }).join('');

      tickerGrid.classList.remove('is-switching');
    }, 120);
  }

  // Category buttons click handler
  catBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      catBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const rawCat = (btn.dataset.category || btn.textContent).trim().toLowerCase();
      let key = 'popular';
      if (rawCat.includes('forex')) key = 'forex';
      else if (rawCat.includes('metal')) key = 'metals';
      else if (rawCat.includes('commodit')) key = 'commodities';
      else if (rawCat.includes('share')) key = 'shares';
      else if (rawCat.includes('crypto')) key = 'cryptocurrencies';

      renderCards(key);
    });
  });

  // Initial active button detection
  const initialBtn = document.querySelector('.ticker-cat-btn.active');
  if (initialBtn) {
    const rawCat = (initialBtn.dataset.category || initialBtn.textContent).trim().toLowerCase();
    let initialKey = 'popular';
    if (rawCat.includes('forex')) initialKey = 'forex';
    else if (rawCat.includes('metal')) initialKey = 'metals';
    else if (rawCat.includes('commodit')) initialKey = 'commodities';
    else if (rawCat.includes('share')) initialKey = 'shares';
    else if (rawCat.includes('crypto')) initialKey = 'cryptocurrencies';

    if (initialKey !== 'popular') {
      renderCards(initialKey);
    }
  }

  // Dynamic real-time micro-fluctuations
  setInterval(() => {
    if (!activeItems.length) return;
    const randomIdx = Math.floor(Math.random() * activeItems.length);
    const item = activeItems[randomIdx];
    const cardEl = tickerGrid.querySelector(`[data-ticker-id="${item.id}"]`);
    if (!cardEl) return;

    // Realistic micro-tick variation
    const tickFactor = item.basePrice > 1000 ? 0.00015 : 0.00025;
    const delta = (Math.random() - 0.48) * (item.basePrice * tickFactor);
    item.basePrice += delta;
    item.changeVal += delta;
    item.changePct = ((item.changeVal / (item.basePrice - item.changeVal)) * 100);
    item.isBullish = item.changeVal >= 0;

    const priceEl = cardEl.querySelector('.ticker-price');
    const changeEl = cardEl.querySelector('.ticker-change');
    const sparkline = cardEl.querySelector('.sparkline-svg polyline');

    if (priceEl && changeEl) {
      priceEl.textContent = formatNumber(item.basePrice, item.decimals);
      const isUp = delta >= 0;

      priceEl.style.color = isUp ? '#00C087' : '#F43F5E';
      cardEl.classList.add(isUp ? 'tick-up' : 'tick-down');

      const changeSign = item.changeVal >= 0 ? '+' : '';
      const pctSign = item.changePct >= 0 ? '+' : '';
      changeEl.textContent = `${changeSign}${item.changeVal.toFixed(item.decimals > 2 ? 4 : item.decimals)} (${pctSign}${item.changePct.toFixed(2)}%)`;
      changeEl.className = `ticker-change ${item.isBullish ? 'bullish' : 'bearish'}`;

      if (sparkline) {
        sparkline.setAttribute('stroke', item.isBullish ? '#00C087' : '#F43F5E');
      }

      setTimeout(() => {
        if (priceEl) priceEl.style.color = '#FFFFFF';
        if (cardEl) {
          cardEl.classList.remove('tick-up');
          cardEl.classList.remove('tick-down');
        }
      }, 650);
    }
  }, 1900);
}

/* Smooth Scrolling */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}
