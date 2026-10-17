/**
 * SPIKE BROKERAGE - INSTITUTIONAL TRADINGVIEW CHART RESIZER ENGINE
 * Enables fluid drag-to-resize, rectangular aspect ratio presets, and state persistence
 */
(function() {
  const DEFAULT_HEIGHT = 620;
  const MIN_HEIGHT = 380;
  const MAX_HEIGHT = 1200;

  function initChartWorkstation(workstation) {
    if (workstation.dataset.chartResizerInit) return;
    workstation.dataset.chartResizerInit = 'true';

    const handle = workstation.querySelector('.spike-chart-drag-handle');
    const heightPill = workstation.querySelector('.spike-chart-height-pill');
    const sizeButtons = workstation.querySelectorAll('.spike-chart-size-btn');

    // Retrieve saved height from localStorage if available
    const savedHeight = parseInt(localStorage.getItem('spike_chart_height'), 10);
    const initialHeight = (!isNaN(savedHeight) && savedHeight >= MIN_HEIGHT && savedHeight <= MAX_HEIGHT)
      ? savedHeight
      : DEFAULT_HEIGHT;

    setWorkstationHeight(workstation, initialHeight, false);

    // Preset Buttons Click Handler
    sizeButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetH = parseInt(btn.dataset.height, 10);
        if (!isNaN(targetH)) {
          setWorkstationHeight(workstation, targetH, true);
          localStorage.setItem('spike_chart_height', targetH);
        }
      });
    });

    // Double-click drag handle to reset to default 620px
    if (handle) {
      handle.addEventListener('dblclick', () => {
        setWorkstationHeight(workstation, DEFAULT_HEIGHT, true);
        localStorage.setItem('spike_chart_height', DEFAULT_HEIGHT);
      });

      // Mouse & Touch Drag Implementation
      let isDragging = false;
      let startY = 0;
      let startHeight = 0;

      function onDragStart(clientY) {
        isDragging = true;
        startY = clientY;
        startHeight = workstation.offsetHeight;
        document.body.classList.add('is-chart-resizing');
        handle.classList.add('active');
        workstation.style.transition = 'none'; // Instant response during drag
      }

      function onDragMove(clientY) {
        if (!isDragging) return;
        const delta = clientY - startY;
        const newH = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, Math.round(startHeight + delta)));
        setWorkstationHeight(workstation, newH, false);
      }

      function onDragEnd() {
        if (!isDragging) return;
        isDragging = false;
        document.body.classList.remove('is-chart-resizing');
        handle.classList.remove('active');
        workstation.style.transition = '';
        localStorage.setItem('spike_chart_height', workstation.offsetHeight);
      }

      // Mouse listeners
      handle.addEventListener('mousedown', (e) => {
        e.preventDefault();
        onDragStart(e.clientY);

        function handleMouseMove(e) {
          onDragMove(e.clientY);
        }

        function handleMouseUp() {
          onDragEnd();
          window.removeEventListener('mousemove', handleMouseMove);
          window.removeEventListener('mouseup', handleMouseUp);
        }

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        window.addEventListener('mouseup', handleMouseUp);
      });

      // Touch listeners for mobile / tablet
      handle.addEventListener('touchstart', (e) => {
        if (e.touches && e.touches.length > 0) {
          onDragStart(e.touches[0].clientY);
        }
      }, { passive: true });

      window.addEventListener('touchmove', (e) => {
        if (isDragging && e.touches && e.touches.length > 0) {
          onDragMove(e.touches[0].clientY);
        }
      }, { passive: true });

      window.addEventListener('touchend', () => {
        if (isDragging) onDragEnd();
      });
    }

    function setWorkstationHeight(ws, h, animate) {
      if (animate) {
        ws.style.transition = 'height 0.25s cubic-bezier(0.16, 1, 0.3, 1)';
        setTimeout(() => ws.style.transition = '', 260);
      }
      ws.style.height = `${h}px`;
      if (heightPill) {
        heightPill.textContent = `${h}px`;
      }

      // Update preset active state
      sizeButtons.forEach(b => {
        const bH = parseInt(b.dataset.height, 10);
        if (Math.abs(bH - h) < 20) {
          b.classList.add('active');
        } else {
          b.classList.remove('active');
        }
      });
    }
  }

  // Automatic Setup & DOM Fallback Wrapper
  function setupAllChartWorkstations() {
    // 1. Existing .spike-chart-workstation elements
    document.querySelectorAll('.spike-chart-workstation').forEach(initChartWorkstation);

    // 2. Auto-wrap any standalone .tradingview-widget-container if not yet wrapped
    document.querySelectorAll('.tradingview-widget-container').forEach(tv => {
      if (tv.closest('.spike-chart-workstation')) return;

      const ws = document.createElement('div');
      ws.className = 'spike-chart-workstation';

      // Build Top Bar
      const topbar = document.createElement('div');
      topbar.className = 'spike-chart-topbar';
      topbar.innerHTML = `
        <div class="spike-chart-topbar-left">
          <div class="spike-chart-sym-badge">
            <span class="spike-chart-sym-icon"></span>
            <span>INTERBANK EXECUTION TERMINAL</span>
          </div>
          <span class="spike-chart-status-pill">DIRECT MARKET ACCESS</span>
        </div>
        <div class="spike-chart-topbar-right">
          <span class="spike-chart-preset-label">Height:</span>
          <button type="button" class="spike-chart-size-btn" data-height="480">480px</button>
          <button type="button" class="spike-chart-size-btn" data-height="620">620px</button>
          <button type="button" class="spike-chart-size-btn" data-height="780">780px</button>
          <button type="button" class="spike-chart-size-btn" data-height="950">Max</button>
        </div>
      `;

      // Build Canvas Wrap
      const canvasWrap = document.createElement('div');
      canvasWrap.className = 'spike-chart-canvas-wrap';

      // Build Bottom Drag Handle
      const handle = document.createElement('div');
      handle.className = 'spike-chart-drag-handle';
      handle.title = 'Click and drag up or down to resize chart height (Double-click to reset)';
      handle.innerHTML = `
        <div class="spike-chart-drag-line"></div>
        <div class="spike-chart-drag-grip">
          <div class="spike-chart-drag-icon">
            <span class="spike-chart-drag-bar bar-1"></span>
            <span class="spike-chart-drag-bar bar-2"></span>
            <span class="spike-chart-drag-bar bar-3"></span>
          </div>
          <span>DRAG TO RESIZE</span>
          <span class="spike-chart-height-pill">620px</span>
        </div>
        <div class="spike-chart-drag-line right"></div>
      `;

      // Insert wrapper into DOM
      tv.parentNode.insertBefore(ws, tv);
      ws.appendChild(topbar);
      canvasWrap.appendChild(tv);
      ws.appendChild(canvasWrap);
      ws.appendChild(handle);

      initChartWorkstation(ws);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupAllChartWorkstations);
  } else {
    setupAllChartWorkstations();
  }
})();
