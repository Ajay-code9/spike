/**
 * SPIKE BROKERAGE - PLATFORMS INTERACTIVE JAVASCRIPT
 * Smooth scrolling navigation, active scrollspy, DOM simulator, API code switcher, and FAQ accordions.
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==================== 1. SMOOTH SCROLLING & NAVIGATION ====================
  const stickyBar = document.querySelector('.platforms-sticky-bar');
  const navPills = document.querySelectorAll('.platform-nav-pill');
  const targetSections = ['desktop', 'web', 'mobile', 'api', 'comparison', 'downloads', 'faq'];

  function scrollToSection(targetId, updateHistory = true) {
    const el = document.getElementById(targetId);
    if (!el) return;

    const headerHeight = 68;
    const stickyHeight = stickyBar ? stickyBar.offsetHeight : 50;
    const totalOffset = headerHeight + stickyHeight + 15;

    const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - totalOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });

    if (updateHistory) {
      history.pushState(null, null, `#${targetId}`);
    }

    // Trigger visual target highlight
    el.classList.remove('section-target-highlight');
    void el.offsetWidth; // trigger reflow
    el.classList.add('section-target-highlight');
    setTimeout(() => {
      el.classList.remove('section-target-highlight');
    }, 1500);

    // Update active pill
    navPills.forEach(pill => {
      if (pill.getAttribute('href') === `#${targetId}`) {
        pill.classList.add('active');
        pill.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' });
      } else {
        pill.classList.remove('active');
      }
    });
  }

  // Handle in-page sticky pills click
  navPills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      e.preventDefault();
      const href = pill.getAttribute('href');
      if (href && href.startsWith('#')) {
        const targetId = href.substring(1);
        scrollToSection(targetId);
      }
    });
  });

  // Handle header dropdown links and all anchor tags pointing to platform hashes
  document.querySelectorAll('a[href*="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href) return;

      let targetId = '';
      if (href.startsWith('#')) {
        targetId = href.substring(1);
      } else if (href.includes('platforms.html#')) {
        targetId = href.split('platforms.html#')[1];
      }

      if (targetId && targetSections.includes(targetId)) {
        e.preventDefault();
        scrollToSection(targetId);
      }
    });
  });

  // On page load check URL hash
  if (window.location.hash) {
    const hashId = window.location.hash.substring(1);
    if (targetSections.includes(hashId)) {
      setTimeout(() => {
        scrollToSection(hashId, false);
      }, 250);
    }
  }

  // ==================== 2. SCROLLSPY (INTERSECTION OBSERVER) ====================
  const observerOptions = {
    root: null,
    rootMargin: '-130px 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navPills.forEach(pill => {
          if (pill.getAttribute('href') === `#${id}`) {
            pill.classList.add('active');
          } else {
            pill.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  targetSections.forEach(id => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });

  // ==================== 3. DESKTOP TERMINAL TABS & DOM SIMULATOR ====================
  const terminalTabs = document.querySelectorAll('.terminal-tab-item');
  const domView = document.getElementById('terminalDomView');
  const chartView = document.getElementById('terminalChartView');
  const testerView = document.getElementById('terminalTesterView');

  if (terminalTabs.length) {
    terminalTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        terminalTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const view = tab.dataset.view;

        if (domView) domView.style.display = (view === 'dom') ? 'block' : 'none';
        if (chartView) chartView.style.display = (view === 'chart') ? 'block' : 'none';
        if (testerView) testerView.style.display = (view === 'tester') ? 'block' : 'none';
      });
    });
  }

  // 1-Click Buy / Sell execution feedback
  const btnBuy = document.getElementById('btnDomBuy');
  const btnSell = document.getElementById('btnDomSell');
  const domFeedback = document.getElementById('domOrderFeedback');

  function triggerTradeSimulation(side) {
    if (!domFeedback) return;
    const price = (side === 'BUY') ? '1.08453' : '1.08451';
    const orderId = Math.floor(100000 + Math.random() * 900000);
    const latency = (6 + Math.random() * 5).toFixed(1);

    domFeedback.innerHTML = `
      <div style="background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.4); border-radius: 6px; padding: 8px 12px; margin-top: 10px; font-size: 0.76rem; color: #34D399; display: flex; align-items: center; justify-content: space-between;">
        <span><strong>Order #${orderId}</strong>: ${side} 1.00 Lot EURUSD @ ${price}</span>
        <span style="color: #94A3B8;">NY4 Fill: ${latency}ms</span>
      </div>
    `;

    setTimeout(() => {
      if (domFeedback) domFeedback.innerHTML = '';
    }, 4500);
  }

  if (btnBuy) btnBuy.addEventListener('click', () => triggerTradeSimulation('BUY'));
  if (btnSell) btnSell.addEventListener('click', () => triggerTradeSimulation('SELL'));

  // Micro-tick price fluctuation in DOM
  let baseBid = 1.08451;
  setInterval(() => {
    const delta = (Math.random() - 0.5) * 0.00006;
    baseBid = Number((baseBid + delta).toFixed(5));
    const baseAsk = Number((baseBid + 0.00001).toFixed(5));

    const bidDisplay = document.getElementById('domLiveBid');
    const askDisplay = document.getElementById('domLiveAsk');
    if (bidDisplay) bidDisplay.textContent = baseBid.toFixed(5);
    if (askDisplay) askDisplay.textContent = baseAsk.toFixed(5);
  }, 2200);

  // ==================== 4. API CODE SNIPPET SWITCHER ====================
  const apiTabBtns = document.querySelectorAll('.api-tab-btn');
  const codeBlocks = {
    python: document.getElementById('codePython'),
    nodejs: document.getElementById('codeNodejs'),
    csharp: document.getElementById('codeCsharp'),
    fix: document.getElementById('codeFix'),
    curl: document.getElementById('codeCurl')
  };

  apiTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      apiTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const lang = btn.dataset.lang;
      Object.keys(codeBlocks).forEach(key => {
        if (codeBlocks[key]) {
          codeBlocks[key].style.display = (key === lang) ? 'block' : 'none';
        }
      });
    });
  });

  // Copy code button
  const copyBtn = document.getElementById('btnCopyApiCode');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const activeCode = document.querySelector('.code-block[style*="display: block"]') || document.getElementById('codePython');
      if (activeCode) {
        navigator.clipboard.writeText(activeCode.innerText).then(() => {
          copyBtn.innerHTML = `✓ Copied!`;
          setTimeout(() => {
            copyBtn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> Copy Code`;
          }, 2000);
        });
      }
    });
  }

  // ==================== 5. FAQ ACCORDION ====================
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question-btn');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        // Close all
        faqItems.forEach(i => i.classList.remove('active'));
        // If not already active, open
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });

});
