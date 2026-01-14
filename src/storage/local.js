/**
 * Local Storage Manager
 * Handles all client-side data persistence
 */

const STORAGE_KEYS = {
    HIGH_SCORES: 'songsnap_high_scores',
    GAME_HISTORY: 'songsnap_game_history',
    SETTINGS: 'songsnap_settings'
};

const MAX_HIGH_SCORES = 10;
const MAX_HISTORY = 50;

/**
 * Save a new high score
 */
export function saveHighScore(score, correctCount, totalRounds) {
    const scores = getHighScores();

    const entry = {
        score,
        correct: correctCount,
        total: totalRounds,
        date: new Date().toISOString()
    };

    scores.push(entry);

    // Sort by score descending and keep top N
    scores.sort((a, b) => b.score - a.score);
    const topScores = scores.slice(0, MAX_HIGH_SCORES);

    localStorage.setItem(STORAGE_KEYS.HIGH_SCORES, JSON.stringify(topScores));

    // Return the rank (1-indexed)
    return topScores.findIndex(s => s === entry) + 1;
}

/**
 * Get all high scores
 */
export function getHighScores() {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.HIGH_SCORES);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error('Failed to load high scores:', e);
        return [];
    }
}

/**
 * Save game to history
 */
export function saveGameHistory(game) {
    const history = getGameHistory();

    history.unshift({
        ...game,
        playedAt: new Date().toISOString()
    });

    // Keep only recent games
    const trimmedHistory = history.slice(0, MAX_HISTORY);

    localStorage.setItem(STORAGE_KEYS.GAME_HISTORY, JSON.stringify(trimmedHistory));
}

/**
 * Get game history
 */
export function getGameHistory() {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.GAME_HISTORY);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error('Failed to load game history:', e);
        return [];
    }
}

/**
 * Save user settings
 */
export function saveSettings(settings) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

/**
 * Get user settings
 */
export function getSettings() {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
        return data ? JSON.parse(data) : getDefaultSettings();
    } catch (e) {
        return getDefaultSettings();
    }
}

/**
 * Get default settings
 */
function getDefaultSettings() {
    return {
        volume: 0.8,
        roundsPerGame: 10,
        useTopTracks: true
    };
}

/**
 * Clear all stored data
 */
export function clearAllData() {
    Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
    });
}

/**
 * Format date for display
 */
export function formatDate(isoString) {
    const date = new Date(isoString);
    const now = new Date();
    const diff = now - date;

    // Less than a day ago
    if (diff < 24 * 60 * 60 * 1000) {
        return 'Today';
    }

    // Less than 2 days ago
    if (diff < 48 * 60 * 60 * 1000) {
        return 'Yesterday';
    }

    // Otherwise show date
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
    });
}
