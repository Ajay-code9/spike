/**
 * SPIKE BROKERAGE - GLOBAL TOAST ENGINE
 * High-performance, zero-dependency notification engine
 */
(function() {
  let container = null;

  function initContainer() {
    if (!container) {
      container = document.getElementById('spike-toast-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'spike-toast-container';
        document.body.appendChild(container);
      }
    }
    return container;
  }

  const icons = {
    success: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>',
    info: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>',
    error: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>'
  };

  window.SpikeToast = {
    show: function(options) {
      const type = options.type || 'info';
      const title = options.title || 'Spike Brokerage';
      const message = options.message || '';
      const duration = options.duration || 4500;

      const c = initContainer();

      const toast = document.createElement('div');
      toast.className = `spike-toast spike-toast-${type}`;

      toast.innerHTML = `
        <div class="spike-toast-icon">${icons[type] || icons.info}</div>
        <div class="spike-toast-content">
          <div class="spike-toast-title">${title}</div>
          ${message ? `<div class="spike-toast-message">${message}</div>` : ''}
        </div>
        <button class="spike-toast-close" aria-label="Close notification">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
        <div class="spike-toast-progress" style="animation-duration: ${duration}ms;"></div>
      `;

      function dismiss() {
        if (toast.classList.contains('spike-toast-hiding')) return;
        toast.classList.add('spike-toast-hiding');
        setTimeout(() => {
          if (toast.parentNode) toast.parentNode.removeChild(toast);
        }, 320);
      }

      toast.querySelector('.spike-toast-close').addEventListener('click', dismiss);

      const timeoutId = setTimeout(dismiss, duration);
      toast.addEventListener('mouseenter', () => clearTimeout(timeoutId));

      c.appendChild(toast);
      return toast;
    },

    success: function(title, message, duration) {
      return this.show({ type: 'success', title, message, duration });
    },

    info: function(title, message, duration) {
      return this.show({ type: 'info', title, message, duration });
    },

    error: function(title, message, duration) {
      return this.show({ type: 'error', title, message, duration });
    }
  };

  // Safe global fallback: replace window.alert with SpikeToast.info
  // so any stray or dynamic alert() automatically looks gorgeous
  const originalAlert = window.alert;
  window.alert = function(msg) {
    if (window.SpikeToast) {
      window.SpikeToast.info('Notification', msg);
    } else {
      originalAlert(msg);
    }
  };
})();
