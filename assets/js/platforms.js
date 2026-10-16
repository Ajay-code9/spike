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
    const stickyHeight = stickyBar ? stickyBar.offsetHeight : 42;
    const totalOffset = headerHeight + stickyHeight + 14;

    const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - totalOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });

    if (updateHistory) {
      history.pushState(null, null, `#${targetId}`);
    }

    // Trigger visual target highlight on the showcase panel
    const showcasePanel = el.querySelector('.platform-showcase-panel') || el;
    showcasePanel.classList.remove('panel-highlight-glow');
    void showcasePanel.offsetWidth; // trigger reflow
    showcasePanel.classList.add('panel-highlight-glow');
    setTimeout(() => {
      showcasePanel.classList.remove('panel-highlight-glow');
    }, 2000);

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
  } else {
    // If no hash in URL, ensure page starts at the top (Hero Section)
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }

  // Header Platforms link on platforms page smoothly scrolls to top
  document.querySelectorAll('.nav-link[href="platforms.html"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      history.pushState(null, null, 'platforms.html');
      navPills.forEach(pill => pill.classList.remove('active'));
      const firstPill = document.querySelector('.platform-nav-pill[href="#desktop"]');
      if (firstPill) firstPill.classList.add('active');
    });
  });

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

  // ==================== 3. DESKTOP TERMINAL TABS & WORKSTATION CONTROLS ====================
  const terminalTabs = document.querySelectorAll('.terminal-tab-item');
  const domView = document.getElementById('terminalDomView');
  const chartView = document.getElementById('terminalChartView');
  const testerView = document.getElementById('terminalTesterView');
  const tradeView = document.getElementById('terminalTradeView');

  if (terminalTabs.length) {
    terminalTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        terminalTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const view = tab.dataset.view;

        if (domView) domView.style.display = (view === 'dom') ? 'block' : 'none';
        if (chartView) chartView.style.display = (view === 'chart') ? 'block' : 'none';
        if (testerView) testerView.style.display = (view === 'tester') ? 'block' : 'none';
        if (tradeView) tradeView.style.display = (view === 'trade') ? 'block' : 'none';
      });
    });
  }

  // Timeframe buttons switching in Desktop & WebTrader
  document.querySelectorAll('.terminal-tf-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const parent = e.target.closest('.terminal-tf-group');
      if (parent) {
        parent.querySelectorAll('.terminal-tf-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      }
    });
  });

  // Lot Stepper in DOM
  let currentLot = 1.00;
  const domLotVal = document.getElementById('domLotVal');
  const btnLotPlus = document.getElementById('btnLotPlus');
  const btnLotMinus = document.getElementById('btnLotMinus');

  if (btnLotPlus && domLotVal) {
    btnLotPlus.addEventListener('click', () => {
      currentLot = Number((currentLot + 0.50).toFixed(2));
      domLotVal.textContent = `${currentLot.toFixed(2)} Lot`;
    });
  }

  if (btnLotMinus && domLotVal) {
    btnLotMinus.addEventListener('click', () => {
      if (currentLot > 0.10) {
        currentLot = Number((currentLot - 0.50).toFixed(2));
        if (currentLot < 0.10) currentLot = 0.10;
        domLotVal.textContent = `${currentLot.toFixed(2)} Lot`;
      }
    });
  }

  // 1-Click Buy / Sell execution feedback
  const btnBuy = document.getElementById('btnDomBuy');
  const btnSell = document.getElementById('btnDomSell');
  const domFeedback = document.getElementById('domOrderFeedback');

  function triggerTradeSimulation(side, symbol = 'EURUSD', lots = currentLot) {
    if (!domFeedback) return;
    const price = (side === 'BUY') ? '1.08452' : '1.08451';
    const orderId = Math.floor(100000 + Math.random() * 900000);
    const latency = (6 + Math.random() * 4).toFixed(1);

    domFeedback.innerHTML = `
      <div style="background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.4); border-radius: 6px; padding: 8px 12px; margin-top: 10px; font-size: 0.76rem; color: #34D399; display: flex; align-items: center; justify-content: space-between; animation: fadeIn 0.2s ease;">
        <span><strong>Order #${orderId}</strong>: ${side} ${lots.toFixed(2)} Lot ${symbol} @ ${price}</span>
        <span style="color: #94A3B8;">NY4 Co-location Fill: <strong style="color: #34D399;">${latency}ms</strong></span>
      </div>
    `;

    setTimeout(() => {
      if (domFeedback) domFeedback.innerHTML = '';
    }, 4500);
  }

  if (btnBuy) btnBuy.addEventListener('click', () => triggerTradeSimulation('BUY'));
  if (btnSell) btnSell.addEventListener('click', () => triggerTradeSimulation('SELL'));

  // WebTrader Buy/Sell triggers
  const btnWtBuy = document.getElementById('btnWtBuy');
  const btnWtSell = document.getElementById('btnWtSell');
  if (btnWtBuy) btnWtBuy.addEventListener('click', () => triggerTradeSimulation('BUY', 'EURUSD', 0.50));
  if (btnWtSell) btnWtSell.addEventListener('click', () => triggerTradeSimulation('SELL', 'EURUSD', 0.50));

  // Phone Buy/Sell triggers
  const btnPhoneBuy = document.getElementById('btnPhoneBuy');
  const btnPhoneSell = document.getElementById('btnPhoneSell');
  if (btnPhoneBuy) btnPhoneBuy.addEventListener('click', () => triggerTradeSimulation('BUY', 'EURUSD', 1.00));
  if (btnPhoneSell) btnPhoneSell.addEventListener('click', () => triggerTradeSimulation('SELL', 'EURUSD', 1.00));

  // Micro-tick price fluctuation in DOM & WebTrader
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

  // ==================== 4. API WORKSTATION & INTERACTIVE SANDBOX ====================
  const apiFileTabs = document.querySelectorAll('.api-file-tab');
  const codeBlocks = {
    python: document.getElementById('codePython'),
    nodejs: document.getElementById('codeNodejs'),
    csharp: document.getElementById('codeCsharp'),
    fix: document.getElementById('codeFix'),
    curl: document.getElementById('codeCurl')
  };

  if (apiFileTabs.length) {
    apiFileTabs.forEach(btn => {
      btn.addEventListener('click', () => {
        apiFileTabs.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const lang = btn.dataset.lang;
        Object.keys(codeBlocks).forEach(key => {
          if (codeBlocks[key]) {
            codeBlocks[key].style.display = (key === lang) ? 'block' : 'none';
          }
        });
      });
    });
  }

  // Copy code button
  const copyBtn = document.getElementById('btnCopyApiCode');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const activeCode = document.querySelector('.code-block[style*="display: block"]') || document.getElementById('codePython');
      if (activeCode) {
        navigator.clipboard.writeText(activeCode.innerText).then(() => {
          copyBtn.innerHTML = `✓ Copied!`;
          setTimeout(() => {
            copyBtn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> Copy`;
          }, 2000);
        });
      }
    });
  }

  // Interactive Sandbox Execution
  const btnRunSandbox = document.getElementById('btnRunApiSandbox');
  const apiConsoleLogs = document.getElementById('apiConsoleLogs');
  const btnClearApiLogs = document.getElementById('btnClearApiLogs');

  if (btnRunSandbox && apiConsoleLogs) {
    btnRunSandbox.addEventListener('click', () => {
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0');
      const orderNum = Math.floor(900000 + Math.random() * 100000);
      const lat = (1.2 + Math.random() * 0.6).toFixed(2);

      const newLog = document.createElement('div');
      newLog.className = 'api-log-entry';
      newLog.innerHTML = `
        <span class="api-log-time">[${timeStr}]</span>
        <span class="api-log-tag-match">[SANDBOX]</span>
        <span style="color: #34D399;">LIMIT BUY 2.50 Lots EURUSD matched @ 1.08450 (Order #${orderNum}) &bull; Latency: <strong>${lat}ms NY4</strong></span>
      `;
      apiConsoleLogs.appendChild(newLog);
      apiConsoleLogs.scrollTop = apiConsoleLogs.scrollHeight;

      btnRunSandbox.innerHTML = `✓ Executed!`;
      setTimeout(() => {
        btnRunSandbox.innerHTML = `<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg> Run Sandbox`;
      }, 1500);
    });
  }

  if (btnClearApiLogs && apiConsoleLogs) {
    btnClearApiLogs.addEventListener('click', () => {
      apiConsoleLogs.innerHTML = `
        <div class="api-log-entry">
          <span class="api-log-time">[${new Date().toTimeString().split(' ')[0]}]</span>
          <span class="api-log-tag-net">[SYSTEM]</span>
          <span>Logs cleared. Stream listening on wss://stream.spikebrokerage.com:9800...</span>
        </div>
      `;
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
