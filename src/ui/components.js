/**
 * UI Components
 * Reusable UI element generators
 */

/**
 * Create a suggestion item for autocomplete
 */
export function createSuggestionItem(track, onClick) {
    const div = document.createElement('div');
    div.className = 'suggestion-item';
    div.dataset.trackId = track.id;

    const albumArt = track.album?.images?.[2]?.url || track.album?.images?.[0]?.url;

    div.innerHTML = `
    ${albumArt ? `<img src="${albumArt}" alt="" class="suggestion-thumb">` : '<div class="suggestion-thumb"></div>'}
    <div class="suggestion-info">
      <div class="suggestion-title">${escapeHtml(track.name)}</div>
      <div class="suggestion-artist">${escapeHtml(track.artists?.map(a => a.name).join(', ') || 'Unknown Artist')}</div>
    </div>
  `;

    div.addEventListener('click', () => onClick(track));

    return div;
}

/**
 * Create feedback element for correct/wrong guess
 */
export function createFeedback(isCorrect, track, points) {
    const div = document.createElement('div');
    div.className = `feedback ${isCorrect ? 'correct' : 'wrong'}`;

    const artistName = track.artists?.map(a => a.name).join(', ') || 'Unknown Artist';

    if (isCorrect) {
        div.innerHTML = `
      <div class="feedback-icon">🎉</div>
      <div class="feedback-text">Correct!</div>
      <div class="feedback-song">${escapeHtml(track.name)} by ${escapeHtml(artistName)}</div>
      <div class="feedback-points">+${points} points</div>
    `;
    } else {
        div.innerHTML = `
      <div class="feedback-icon">😔</div>
      <div class="feedback-text">Oops! The answer was:</div>
      <div class="feedback-song">${escapeHtml(track.name)} by ${escapeHtml(artistName)}</div>
    `;
    }

    return div;
}

/**
 * Create a high score list item
 */
export function createHighScoreItem(entry) {
    const li = document.createElement('li');

    const date = new Date(entry.date);
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    li.innerHTML = `
    <span class="score-entry">
      <span class="score-points">${entry.score.toLocaleString()}</span>
      <span class="score-date">${entry.correct}/${entry.total} • ${dateStr}</span>
    </span>
  `;

    return li;
}

/**
 * Update tier display
 */
export function updateTierDisplay(tierIndex) {
    document.querySelectorAll('.time-tier').forEach((el, index) => {
        if (index < tierIndex) {
            el.dataset.used = 'true';
            el.dataset.active = 'false';
        } else if (index === tierIndex) {
            el.dataset.used = 'false';
            el.dataset.active = 'true';
        } else {
            el.dataset.used = 'false';
            el.dataset.active = 'false';
        }
    });
}

/**
 * Reset tier display
 */
export function resetTierDisplay() {
    document.querySelectorAll('.time-tier').forEach((el, index) => {
        el.dataset.used = 'false';
        el.dataset.active = index === 0 ? 'true' : 'false';
    });
}

/**
 * Update progress bar
 */
export function updateProgressBar(elapsed, total) {
    const fill = document.getElementById('progress-fill');
    const display = document.getElementById('time-display');

    if (fill) {
        const percent = Math.min((elapsed / total) * 100, 100);
        fill.style.width = `${percent}%`;
    }

    if (display) {
        display.textContent = `${elapsed.toFixed(1)}s`;
    }
}

/**
 * Reset progress bar
 */
export function resetProgressBar() {
    const fill = document.getElementById('progress-fill');
    const display = document.getElementById('time-display');

    if (fill) fill.style.width = '0%';
    if (display) display.textContent = '0.0s';
}

/**
 * Show/hide album art
 */
export function setAlbumArt(url, revealed = false) {
    const container = document.getElementById('album-art');
    if (!container) return;

    // Remove existing image
    const existingImg = container.querySelector('img');
    if (existingImg) {
        existingImg.remove();
    }

    if (url) {
        const img = document.createElement('img');
        img.src = url;
        img.alt = 'Album art';
        if (revealed) {
            img.classList.add('revealed');
        }
        container.appendChild(img);

        // Hide placeholder
        const placeholder = container.querySelector('.album-placeholder');
        if (placeholder) placeholder.style.display = 'none';
    } else {
        // Show placeholder
        const placeholder = container.querySelector('.album-placeholder');
        if (placeholder) placeholder.style.display = 'flex';
    }
}

/**
 * Reveal album art with animation
 */
export function revealAlbumArt() {
    const img = document.querySelector('#album-art img');
    if (img) {
        img.classList.add('revealed');
    }
}

/**
 * Set visualizer state
 */
export function setVisualizerActive(active) {
    const visualizer = document.getElementById('visualizer');
    if (visualizer) {
        visualizer.classList.toggle('active', active);
    }
}

/**
 * Update play button state
 */
export function setPlayButtonState(isPlaying) {
    const btn = document.getElementById('play-btn');
    if (!btn) return;

    btn.classList.toggle('playing', isPlaying);

    const icon = btn.querySelector('.play-icon');
    const text = btn.querySelector('span:last-child');

    if (icon) {
        icon.innerHTML = isPlaying
            ? '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>'
            : '<path d="M8 5v14l11-7z"/>';
    }

    if (text) {
        text.textContent = isPlaying ? 'Playing...' : 'Play Clip';
    }
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Show loading overlay
 */
export function showLoading(text = 'Loading...') {
    const overlay = document.getElementById('loading-overlay');
    const textEl = document.getElementById('loading-text');

    if (overlay) overlay.classList.add('active');
    if (textEl) textEl.textContent = text;
}

/**
 * Hide loading overlay
 */
export function hideLoading() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) overlay.classList.remove('active');
}
