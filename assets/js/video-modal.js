/**
 * SPIKE BROKERAGE - CINEMATIC VIDEO THEATER ENGINE
 * Opens rich media modal player instead of native alert()
 */
(function() {
  let modalBackdrop = null;
  let isPlaying = false;

  function initModal() {
    if (modalBackdrop) return modalBackdrop;

    modalBackdrop = document.createElement('div');
    modalBackdrop.className = 'spike-video-modal-backdrop';
    modalBackdrop.id = 'spike-video-modal';

    modalBackdrop.innerHTML = `
      <div class="spike-video-modal-dialog">
        <div class="spike-video-modal-header">
          <div class="spike-video-modal-badge">
            <span class="spike-ticker-pulse" style="width: 6px; height: 6px;"></span>
            <span>4K ULTRA HD MASTERCLASS</span>
          </div>
          <button class="spike-video-modal-close" id="spike-video-close" aria-label="Close video player">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div class="spike-video-viewport">
          <img id="spike-video-poster" src="public/articles/video-course-candlesticks.jpg" alt="Video Lesson">
          <div class="spike-video-overlay-ui">
            <div></div>
            <div class="spike-video-big-play" id="spike-video-play-btn">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 3 20 12 6 21 6 3"></polygon></svg>
            </div>
            <div class="spike-video-controls-bar">
              <div class="spike-video-progress-bar">
                <div class="spike-video-progress-fill" id="spike-video-fill"></div>
              </div>
              <div class="spike-video-controls-row">
                <div style="display: flex; gap: 14px; align-items: center;">
                  <span id="spike-video-status" style="color: #00C087; font-weight: 700;">STREAMING</span>
                  <span id="spike-video-time">14:20 / 48:30</span>
                </div>
                <div style="display: flex; gap: 14px; align-items: center;">
                  <span>1080p 60fps</span>
                  <span>Audio: Stereo 320k</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="spike-video-modal-footer">
          <div>
            <div class="spike-video-modal-title" id="spike-video-title">Candlestick Math & Order Flow Mechanics</div>
            <div class="spike-video-modal-author" id="spike-video-author">Spike Institutional Macro Desk &bull; Module 01 of 04</div>
          </div>
          <div style="display: flex; gap: 10px;">
            <button class="btn btn-outline btn-sm" onclick="SpikeToast.success('Curriculum Downloaded', 'Strategy PDF saved to your downloads.');">Download Notes (PDF)</button>
            <button class="btn btn-gold btn-sm" onclick="SpikeToast.success('Enrolled!', 'Course added to your Spike Academy dashboard.');">Save Pathway</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modalBackdrop);

    document.getElementById('spike-video-close').addEventListener('click', closePlayer);
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closePlayer();
    });

    document.getElementById('spike-video-play-btn').addEventListener('click', () => {
      isPlaying = !isPlaying;
      const statusEl = document.getElementById('spike-video-status');
      if (isPlaying) {
        if (statusEl) statusEl.textContent = 'PAUSED';
        if (statusEl) statusEl.style.color = '#E5B869';
      } else {
        if (statusEl) statusEl.textContent = 'STREAMING';
        if (statusEl) statusEl.style.color = '#00C087';
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closePlayer();
    });

    return modalBackdrop;
  }

  function closePlayer() {
    if (modalBackdrop) {
      modalBackdrop.classList.remove('active');
    }
  }

  window.SpikeVideo = {
    play: function(title, author, posterSrc) {
      const modal = initModal();
      const titleEl = document.getElementById('spike-video-title');
      const authorEl = document.getElementById('spike-video-author');
      const posterEl = document.getElementById('spike-video-poster');

      if (titleEl) titleEl.textContent = title || 'Spike Masterclass';
      if (authorEl) authorEl.textContent = author || 'Spike Institutional Research Desk';
      if (posterEl && posterSrc) posterEl.src = posterSrc;

      modal.classList.add('active');
      if (window.SpikeToast) {
        window.SpikeToast.info('Masterclass Player', `Streaming: ${title}`);
      }
    },
    close: closePlayer
  };
})();
