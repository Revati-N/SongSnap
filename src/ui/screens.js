/**
 * Screen Manager
 * Handles screen transitions and display
 */

const screens = {
    login: 'login-screen',
    game: 'game-screen',
    results: 'results-screen'
};

let currentScreen = 'login';

/**
 * Show a specific screen
 */
export function showScreen(screenName) {
    if (!screens[screenName]) {
        console.error(`Unknown screen: ${screenName}`);
        return;
    }

    // Hide all screens
    Object.values(screens).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.remove('active');
    });

    // Show target screen
    const targetEl = document.getElementById(screens[screenName]);
    if (targetEl) {
        targetEl.classList.add('active');
        currentScreen = screenName;
    }
}

/**
 * Get current screen
 */
export function getCurrentScreen() {
    return currentScreen;
}

/**
 * Show login screen
 */
export function showLoginScreen() {
    showScreen('login');
}

/**
 * Show game screen
 */
export function showGameScreen() {
    showScreen('game');
}

/**
 * Show results screen
 */
export function showResultsScreen() {
    showScreen('results');
}
