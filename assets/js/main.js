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

  toggleBtn.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    toggleBtn.classList.toggle('active');
  });

  // Close when clicking nav link on mobile
  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      toggleBtn.classList.remove('active');
    });
  });
}

/* Modal Controllers (Search, Login, Open Account) */
function initModals() {
  // Modal targets
  const loginModal = document.getElementById('loginModal');
  const accountModal = document.getElementById('accountModal');
  const searchModal = document.getElementById('searchModal');

  // Trigger buttons
  document.querySelectorAll('[data-open-modal="login"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(loginModal);
    });
  });

  document.querySelectorAll('[data-open-modal="account"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
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

/* Live Market Ticker with Micro Fluctuations */
function initLiveTicker() {
  const tickerItems = [
    { id: 'eurusd', symbol: 'EUR/USD', basePrice: 1.0794, spread: 0.2, change: '+0.0017 (+0.16%)', isBullish: true, decimals: 4 },
    { id: 'gbpusd', symbol: 'GBP/USD', basePrice: 1.2541, spread: 0.2, change: '-0.0025 (-0.20%)', isBullish: false, decimals: 4 },
    { id: 'xauusd', symbol: 'XAU/USD', basePrice: 2366.82, spread: 3.2, change: '+12.15 (+0.52%)', isBullish: true, decimals: 2 },
    { id: 'us30', symbol: 'US30', basePrice: 38452.6, spread: 2.5, change: '+101.4 (+0.26%)', isBullish: true, decimals: 1 },
    { id: 'btcusd', symbol: 'BTC/USD', basePrice: 67421.5, spread: 36.8, change: '+1121.3 (+1.69%)', isBullish: true, decimals: 1 }
  ];

  // Category switching in ticker bar
  const catBtns = document.querySelectorAll('.ticker-cat-btn');
  catBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      catBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Subtle real-time price tick simulation
  setInterval(() => {
    const randomIdx = Math.floor(Math.random() * tickerItems.length);
    const item = tickerItems[randomIdx];
    const el = document.querySelector(`[data-ticker-id="${item.id}"]`);
    if (!el) return;

    const delta = (Math.random() - 0.48) * (item.basePrice * 0.0003);
    const newPrice = item.basePrice + delta;
    const priceEl = el.querySelector('.ticker-price');
    if (priceEl) {
      priceEl.textContent = newPrice.toLocaleString('en-US', {
        minimumFractionDigits: item.decimals,
        maximumFractionDigits: item.decimals
      });
      priceEl.style.transition = 'color 0.3s ease';
      priceEl.style.color = delta >= 0 ? 'var(--color-bullish)' : 'var(--color-bearish)';
      setTimeout(() => {
        priceEl.style.color = '#FFFFFF';
      }, 600);
    }
  }, 2200);
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
