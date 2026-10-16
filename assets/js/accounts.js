/**
 * SPIKE BROKERAGE - INSTITUTIONAL ACCOUNTS INTERACTIVE LOGIC
 */

document.addEventListener('DOMContentLoaded', () => {
  // 0. Hero Interactive Tier Switcher Widget
  const heroTierBtns = document.querySelectorAll('.hero-tier-btn');
  const heroTierTitle = document.getElementById('hero-tier-title');
  const heroTierSub = document.getElementById('hero-tier-sub');
  const heroTierDep = document.getElementById('hero-tier-dep');
  const heroTierSpread = document.getElementById('hero-tier-spread');
  const heroTierComm = document.getElementById('hero-tier-comm');
  const heroTierSpeed = document.getElementById('hero-tier-speed');
  const heroTierLev = document.getElementById('hero-tier-lev');
  const heroTierFeatures = document.getElementById('hero-tier-features');
  const heroTierCta = document.getElementById('hero-tier-cta');

  const heroTierData = {
    standard: {
      title: 'STANDARD ACCOUNT',
      sub: 'For discretionary & swing traders seeking simple all-in spreads',
      dep: '$100',
      spread: '1.0 Pip',
      comm: '$0.00 / Lot',
      speed: '< 25ms STP',
      lev: '1:500',
      features: [
        'Zero commission across 500+ instruments',
        'Micro-lot trading starting at 0.01 lots',
        'Negative Balance Protection guaranteed'
      ],
      cta: 'Open Standard Account →'
    },
    pro: {
      title: 'PRO ECN (RAW)',
      sub: 'Engineered for fast scalping, day trading & EA algorithms',
      dep: '$1,000',
      spread: '0.0 Pips',
      comm: '$3.50 / Lot',
      speed: '< 12ms NY4',
      lev: '1:500',
      features: [
        'Raw interbank spreads from 0.0 pips',
        'Level II Depth of Market (DOM) volume ladder',
        'Priority server queue with zero requotes'
      ],
      cta: 'Open Pro ECN Account →'
    },
    vip: {
      title: 'VIP INSTITUTIONAL',
      sub: 'Bespoke liquidity for quant funds, prop desks & family offices',
      dep: '$10,000',
      spread: '0.0 Pips',
      comm: 'From $1.50',
      speed: '< 2ms NY4',
      lev: '1:500',
      features: [
        'Tiered volume rebates up to 40% cashback',
        'Direct FIX 4.4 protocol & Quant Python APIs',
        'Free dedicated Equinix NY4 Cross-Connect VPS'
      ],
      cta: 'Open VIP Account →'
    }
  };

  heroTierBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      heroTierBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tier = btn.getAttribute('data-tier') || 'pro';
      const d = heroTierData[tier] || heroTierData.pro;

      if (heroTierTitle) heroTierTitle.textContent = d.title;
      if (heroTierSub) heroTierSub.textContent = d.sub;
      if (heroTierDep) heroTierDep.textContent = d.dep;
      if (heroTierSpread) heroTierSpread.textContent = d.spread;
      if (heroTierComm) heroTierComm.textContent = d.comm;
      if (heroTierSpeed) heroTierSpeed.textContent = d.speed;
      if (heroTierLev) heroTierLev.textContent = d.lev;
      if (heroTierCta) heroTierCta.textContent = d.cta;

      if (heroTierFeatures) {
        heroTierFeatures.innerHTML = d.features.map(f => `
          <div class="tier-feat-item">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
            <span>${f}</span>
          </div>
        `).join('');
      }
    });
  });

  // 1. Currency Switcher
  const currencyBtns = document.querySelectorAll('.currency-btn');
  const depositStandard = document.getElementById('deposit-val-standard');
  const depositPro = document.getElementById('deposit-val-pro');
  const depositVip = document.getElementById('deposit-val-vip');

  const currencyRates = {
    USD: { symbol: '$', std: '100', pro: '1,000', vip: '10,000' },
    EUR: { symbol: '€', std: '100', pro: '1,000', vip: '10,000' },
    GBP: { symbol: '£', std: '100', pro: '1,000', vip: '10,000' },
    USDT: { symbol: '₮', std: '100', pro: '1,000', vip: '10,000' }
  };

  currencyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      currencyBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const curr = btn.getAttribute('data-currency') || 'USD';
      const cData = currencyRates[curr] || currencyRates.USD;

      if (depositStandard) depositStandard.textContent = `${cData.symbol}${cData.std}`;
      if (depositPro) depositPro.textContent = `${cData.symbol}${cData.pro}`;
      if (depositVip) depositVip.textContent = `${cData.symbol}${cData.vip}`;
    });
  });

  // 2. Islamic Swap-Free Toggle
  const islamicToggle = document.getElementById('islamic-toggle-checkbox');
  const swapBadges = document.querySelectorAll('.swap-free-indicator');

  if (islamicToggle) {
    islamicToggle.addEventListener('change', (e) => {
      const isSwapFree = e.target.checked;
      swapBadges.forEach(badge => {
        badge.style.display = isSwapFree ? 'inline-flex' : 'none';
      });
    });
  }

  // 3. Interactive Account Selector Quiz
  const styleSelect = document.getElementById('quiz-style');
  const depositSelect = document.getElementById('quiz-deposit');
  const resultBadge = document.getElementById('quiz-result-badge');
  const resultDesc = document.getElementById('quiz-result-desc');
  const resultCta = document.getElementById('quiz-result-cta');

  function updateQuizRecommendation() {
    if (!styleSelect || !depositSelect || !resultBadge || !resultDesc) return;
    const style = styleSelect.value;
    const deposit = depositSelect.value;

    if (deposit === 'vip' || style === 'algo_quant') {
      resultBadge.textContent = 'RECOMMENDED: VIP INSTITUTIONAL';
      resultBadge.style.background = 'linear-gradient(135deg, #FDE68A 0%, #E5B869 100%)';
      resultDesc.textContent = 'You qualify for our VIP Institutional tier with 0.0 pip raw spreads, customized volume rebates, dedicated FIX 4.4 API, and private quant specialist.';
      if (resultCta) resultCta.textContent = 'Open VIP Account →';
    } else if (deposit === 'pro' || style === 'scalp' || style === 'daytrade') {
      resultBadge.textContent = 'RECOMMENDED: PRO ECN (RAW)';
      resultBadge.style.background = 'linear-gradient(135deg, #FDE68A 0%, #E5B869 100%)';
      resultDesc.textContent = 'Ideal match! Pro ECN delivers true raw interbank spreads from 0.0 pips with sub-12ms NY4 execution and full Level II DOM orderbook depth.';
      if (resultCta) resultCta.textContent = 'Open Pro ECN Account →';
    } else {
      resultBadge.textContent = 'RECOMMENDED: STANDARD ACCOUNT';
      resultBadge.style.background = '#38BDF8';
      resultDesc.textContent = 'Standard Account is ideal for swing & discretionary trading with $0 commission, micro-lot flexibility, and simple all-in spreads.';
      if (resultCta) resultCta.textContent = 'Open Standard Account →';
    }
  }

  if (styleSelect && depositSelect) {
    styleSelect.addEventListener('change', updateQuizRecommendation);
    depositSelect.addEventListener('change', updateQuizRecommendation);
  }

  // 4. Matrix Filter Tabs
  const matrixTabs = document.querySelectorAll('.matrix-tab-btn');
  const matrixRows = document.querySelectorAll('.accounts-table tbody tr');

  matrixTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      matrixTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const cat = tab.getAttribute('data-category') || 'all';

      matrixRows.forEach(row => {
        if (cat === 'all') {
          row.style.display = '';
        } else {
          const rowCat = row.getAttribute('data-category');
          if (row.classList.contains('category-row')) {
            row.style.display = (rowCat === cat) ? '' : 'none';
          } else {
            row.style.display = (rowCat === cat) ? '' : 'none';
          }
        }
      });
    });
  });

  // 5. Matrix Search
  const matrixSearchInput = document.getElementById('matrix-search-input');
  if (matrixSearchInput) {
    matrixSearchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      matrixRows.forEach(row => {
        if (row.classList.contains('category-row')) return;
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(q) ? '' : 'none';
      });
    });
  }

  // 6. Interactive Trading Cost Calculator (on Compare page)
  const calcLotsInput = document.getElementById('calc-lots');
  const calcLotsVal = document.getElementById('calc-lots-val');
  const costStd = document.getElementById('cost-std-val');
  const costPro = document.getElementById('cost-pro-val');
  const costVip = document.getElementById('cost-vip-val');
  const costSavings = document.getElementById('cost-savings-val');

  function calculateTradingCosts() {
    if (!calcLotsInput) return;
    const lots = parseFloat(calcLotsInput.value) || 10;
    if (calcLotsVal) calcLotsVal.textContent = lots;

    // Standard: 1.2 pip avg = $12/lot spread, $0 commission = $12/lot
    const stdCost = Math.round(lots * 12);
    // Pro: 0.1 pip avg = $1/lot spread + $7 commission = $8/lot
    const proCost = Math.round(lots * 8);
    // VIP: 0.05 pip avg = $0.50/lot spread + $4 commission = $4.50/lot
    const vipCost = Math.round(lots * 4.5);

    const savings = stdCost - proCost;

    if (costStd) costStd.textContent = `$${stdCost.toLocaleString()}`;
    if (costPro) costPro.textContent = `$${proCost.toLocaleString()}`;
    if (costVip) costVip.textContent = `$${vipCost.toLocaleString()}`;
    if (costSavings) costSavings.textContent = `$${savings.toLocaleString()}`;
  }

  if (calcLotsInput) {
    calcLotsInput.addEventListener('input', calculateTradingCosts);
    calculateTradingCosts();
  }

  // 7. FAQ Accordion Toggle
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(i => i.classList.remove('active'));
        if (!isActive) item.classList.add('active');
      });
    }
  });

  // 8. Sticky Nav Active State on Scroll
  const stickyPills = document.querySelectorAll('.accounts-nav-pill');
  const observedSections = document.querySelectorAll('section[id]');

  if (stickyPills.length > 0 && observedSections.length > 0) {
    window.addEventListener('scroll', () => {
      let currentId = '';
      observedSections.forEach(section => {
        const sectionTop = section.offsetTop - 140;
        const sectionHeight = section.offsetHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
          currentId = section.getAttribute('id');
        }
      });

      if (currentId) {
        stickyPills.forEach(pill => {
          pill.classList.toggle('active', pill.getAttribute('href') === `#${currentId}`);
        });
      }
    });
  }
});
