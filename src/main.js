/**
 * SongSnap - Main Application Entry
 * Spotify Song Guessing Game
 */

import './styles/index.css';
import {
    redirectToSpotifyAuth,
    handleCallback,
    isLoggedIn,
    logout
} from './auth/spotify.js';
import { gameEngine } from './game/engine.js';
import { getHighScores } from './storage/local.js';
import { showLoginScreen, showGameScreen, showResultsScreen } from './ui/screens.js';
import {
    createSuggestionItem,
    createFeedback,
    createHighScoreItem,
    updateTierDisplay,
    resetTierDisplay,
    updateProgressBar,
    resetProgressBar,
    setAlbumArt,
    revealAlbumArt,
    setVisualizerActive,
    setPlayButtonState,
    showLoading,
    hideLoading
} from './ui/components.js';
import { launchConfetti, shake, animateScore } from './ui/animations.js';

// DOM Elements
let loginBtn, logoutBtn, playBtn, submitGuessBtn, skipBtn;
let guessInput, suggestionsDropdown;
let currentRoundEl, totalRoundsEl, currentScoreEl;
let feedbackContainer;
let finalScoreEl, correctCountEl, accuracyEl, bestStreakEl, highScoresList;
let playAgainBtn, backToMenuBtn;

// State
let selectedTrack = null;
let isPlayingClip = false;

/**
 * Initialize the application
 */
async function init() {
    // Cache DOM elements
    cacheElements();

    // Set up event listeners
    setupEventListeners();

    // Check for OAuth callback
    try {
        const wasCallback = await handleCallback();
        if (wasCallback) {
            // Successfully logged in, start loading
            await startLoadingGame();
            return;
        }
    } catch (e) {
        console.error('OAuth callback error:', e);
        showError('Login failed. Please try again.');
    }

    // Check if already logged in
    if (isLoggedIn()) {
        await startLoadingGame();
    } else {
        showLoginScreen();
    }
}

/**
 * Cache all DOM element references
 */
function cacheElements() {
    loginBtn = document.getElementById('login-btn');
    logoutBtn = document.getElementById('logout-btn');
    playBtn = document.getElementById('play-btn');
    submitGuessBtn = document.getElementById('submit-guess-btn');
    skipBtn = document.getElementById('skip-btn');
    guessInput = document.getElementById('guess-input');
    suggestionsDropdown = document.getElementById('suggestions');
    currentRoundEl = document.getElementById('current-round');
    totalRoundsEl = document.getElementById('total-rounds');
    currentScoreEl = document.getElementById('current-score');
    feedbackContainer = document.getElementById('feedback-container');
    finalScoreEl = document.getElementById('final-score-value');
    correctCountEl = document.getElementById('correct-count');
    accuracyEl = document.getElementById('accuracy-percent');
    bestStreakEl = document.getElementById('best-streak');
    highScoresList = document.getElementById('high-scores-list');
    playAgainBtn = document.getElementById('play-again-btn');
    backToMenuBtn = document.getElementById('back-to-menu-btn');
}

/**
 * Set up all event listeners
 */
function setupEventListeners() {
    // Login
    loginBtn?.addEventListener('click', handleLogin);

    // Logout
    logoutBtn?.addEventListener('click', handleLogout);

    // Play clip
    playBtn?.addEventListener('click', handlePlayClip);

    // Submit guess
    submitGuessBtn?.addEventListener('click', handleSubmitGuess);

    // Skip / Reveal more
    skipBtn?.addEventListener('click', handleSkip);

    // Guess input
    guessInput?.addEventListener('input', handleGuessInput);
    guessInput?.addEventListener('keydown', handleGuessKeydown);
    guessInput?.addEventListener('focus', () => {
        if (guessInput.value.length >= 2) {
            showSuggestions(gameEngine.searchTracks(guessInput.value));
        }
    });

    // Click outside to close suggestions
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.guess-input-wrapper')) {
            hideSuggestions();
        }
    });

    // Results screen buttons
    playAgainBtn?.addEventListener('click', handlePlayAgain);
    backToMenuBtn?.addEventListener('click', handleBackToMenu);
}

/**
 * Handle login button click
 */
function handleLogin() {
    redirectToSpotifyAuth();
}

/**
 * Handle logout
 */
function handleLogout() {
    logout();
    gameEngine.stopAudio();
    showLoginScreen();
}

/**
 * Start loading game data
 */
async function startLoadingGame() {
    showLoading('Connecting to Spotify...');

    try {
        await gameEngine.initialize((msg) => {
            showLoading(msg);
        });

        hideLoading();
        startNewGame();
    } catch (e) {
        hideLoading();
        console.error('Failed to load game:', e);

        if (e.message.includes('Not enough tracks')) {
            showError('Not enough songs with preview clips in your library. Try saving more songs on Spotify!');
        } else if (e.message.includes('Not authenticated')) {
            logout();
            showLoginScreen();
        } else {
            showError(`Failed to load: ${e.message}`);
        }
    }
}

/**
 * Start a new game
 */
async function startNewGame() {
    const gameInfo = gameEngine.startGame();

    // Update UI
    totalRoundsEl.textContent = gameInfo.totalRounds;
    currentScoreEl.textContent = '0';

    // Clear feedback
    feedbackContainer.innerHTML = '';

    // Show game screen
    showGameScreen();

    // Start first round
    await startRound();
}

/**
 * Start a new round
 */
async function startRound() {
    const round = gameEngine.getCurrentRound();
    if (!round) {
        endGame();
        return;
    }

    // Update round display
    currentRoundEl.textContent = round.roundNumber;

    // Reset UI state
    resetTierDisplay();
    resetProgressBar();
    setAlbumArt(null);
    setVisualizerActive(false);
    setPlayButtonState(false);
    clearGuessInput();
    feedbackContainer.innerHTML = '';

    // Enable controls
    playBtn.disabled = false;
    submitGuessBtn.disabled = false;
    skipBtn.disabled = false;
    guessInput.disabled = false;

    // Load the track audio
    try {
        showLoading('Loading song...');
        await gameEngine.loadCurrentTrack();
        hideLoading();
    } catch (e) {
        hideLoading();
        console.error('Failed to load track:', e);
        // Skip to next round
        handleSkip();
    }
}

/**
 * Handle play clip button
 */
function handlePlayClip() {
    if (isPlayingClip) {
        // Stop playback
        gameEngine.stopAudio();
        setPlayButtonState(false);
        setVisualizerActive(false);
        isPlayingClip = false;
        return;
    }

    const round = gameEngine.getCurrentRound();
    if (!round || round.isComplete) return;

    isPlayingClip = true;
    setPlayButtonState(true);
    setVisualizerActive(true);

    gameEngine.playCurrentTier(
        // On time update
        (elapsed, total) => {
            updateProgressBar(elapsed, total);
        },
        // On complete
        () => {
            setPlayButtonState(false);
            setVisualizerActive(false);
            isPlayingClip = false;
        }
    );
}

/**
 * Handle guess input
 */
function handleGuessInput(e) {
    const query = e.target.value;
    selectedTrack = null;

    if (query.length < 2) {
        hideSuggestions();
        return;
    }

    const results = gameEngine.searchTracks(query);
    showSuggestions(results);
}

/**
 * Handle keyboard navigation in guess input
 */
function handleGuessKeydown(e) {
    const items = suggestionsDropdown.querySelectorAll('.suggestion-item');
    const activeItem = suggestionsDropdown.querySelector('.suggestion-item.selected');

    if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (!activeItem && items.length > 0) {
            items[0].classList.add('selected');
        } else if (activeItem && activeItem.nextElementSibling) {
            activeItem.classList.remove('selected');
            activeItem.nextElementSibling.classList.add('selected');
        }
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (activeItem && activeItem.previousElementSibling) {
            activeItem.classList.remove('selected');
            activeItem.previousElementSibling.classList.add('selected');
        }
    } else if (e.key === 'Enter') {
        e.preventDefault();
        if (activeItem) {
            selectSuggestion(activeItem.dataset.trackId);
        } else if (selectedTrack) {
            handleSubmitGuess();
        }
    } else if (e.key === 'Escape') {
        hideSuggestions();
    }
}

/**
 * Show suggestions dropdown
 */
function showSuggestions(tracks) {
    suggestionsDropdown.innerHTML = '';

    if (tracks.length === 0) {
        hideSuggestions();
        return;
    }

    tracks.forEach(track => {
        const item = createSuggestionItem(track, (t) => {
            selectTrack(t);
        });
        suggestionsDropdown.appendChild(item);
    });

    suggestionsDropdown.classList.add('active');
}

/**
 * Hide suggestions dropdown
 */
function hideSuggestions() {
    suggestionsDropdown.classList.remove('active');
    suggestionsDropdown.innerHTML = '';
}

/**
 * Select a track from suggestions
 */
function selectSuggestion(trackId) {
    const track = gameEngine.getAllTracks().find(t => t.id === trackId);
    if (track) {
        selectTrack(track);
    }
}

/**
 * Select a track
 */
function selectTrack(track) {
    selectedTrack = track;
    guessInput.value = `${track.name} - ${track.artists?.[0]?.name || 'Unknown'}`;
    hideSuggestions();
}

/**
 * Clear guess input
 */
function clearGuessInput() {
    guessInput.value = '';
    selectedTrack = null;
    hideSuggestions();
}

/**
 * Handle submit guess
 */
function handleSubmitGuess() {
    if (!selectedTrack) {
        shake(guessInput);
        return;
    }

    const result = gameEngine.submitGuess(selectedTrack.id);

    if (!result.valid) return;

    // Stop any playing audio
    gameEngine.stopAudio();
    setPlayButtonState(false);
    setVisualizerActive(false);
    isPlayingClip = false;

    // Show feedback
    showFeedback(result.correct, result.track, result.points);

    // Update score
    const prevScore = parseInt(currentScoreEl.textContent) || 0;
    animateScore(currentScoreEl, prevScore, result.totalScore);

    // Reveal album art
    const albumUrl = result.track.album?.images?.[0]?.url;
    setAlbumArt(albumUrl, true);

    // Celebrations for correct answers
    if (result.correct) {
        launchConfetti(2000);
    } else {
        shake(feedbackContainer);
    }

    // Disable controls
    playBtn.disabled = true;
    submitGuessBtn.disabled = true;
    skipBtn.disabled = true;
    guessInput.disabled = true;

    // Move to next round after delay
    setTimeout(() => {
        proceedToNextRound();
    }, 2500);
}

/**
 * Handle skip / reveal more
 */
function handleSkip() {
    const result = gameEngine.revealMore();

    if (!result.hasMore) {
        // No more reveals, show the answer
        gameEngine.stopAudio();
        setPlayButtonState(false);
        setVisualizerActive(false);
        isPlayingClip = false;

        showFeedback(false, result.track, 0);

        // Reveal album art
        const albumUrl = result.track.album?.images?.[0]?.url;
        setAlbumArt(albumUrl, true);

        shake(feedbackContainer);

        // Disable controls
        playBtn.disabled = true;
        submitGuessBtn.disabled = true;
        skipBtn.disabled = true;
        guessInput.disabled = true;

        // Move to next round after delay
        setTimeout(() => {
            proceedToNextRound();
        }, 2500);
    } else {
        // Update tier display
        updateTierDisplay(result.tierIndex);
        resetProgressBar();

        // Stop current playback
        gameEngine.stopAudio();
        setPlayButtonState(false);
        setVisualizerActive(false);
        isPlayingClip = false;
    }
}

/**
 * Proceed to next round
 */
function proceedToNextRound() {
    const result = gameEngine.nextRound();

    if (result.gameOver) {
        endGame();
    } else {
        startRound();
    }
}

/**
 * Show feedback for guess result
 */
function showFeedback(isCorrect, track, points) {
    feedbackContainer.innerHTML = '';
    const feedback = createFeedback(isCorrect, track, points);
    feedbackContainer.appendChild(feedback);
}

/**
 * End the game and show results
 */
function endGame() {
    const results = gameEngine.endGame();

    // Update results UI
    animateScore(finalScoreEl, 0, results.score, 1000);
    correctCountEl.textContent = results.correctCount;
    accuracyEl.textContent = `${results.accuracy}%`;
    bestStreakEl.textContent = results.bestStreak;

    // Update high scores
    updateHighScoresList();

    // Show results screen
    showResultsScreen();

    // Celebrate if good score
    if (results.accuracy >= 70) {
        launchConfetti(3000);
    }
}

/**
 * Update high scores list
 */
function updateHighScoresList() {
    highScoresList.innerHTML = '';

    const scores = getHighScores();

    if (scores.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'No high scores yet!';
        li.style.opacity = '0.5';
        li.style.listStyle = 'none';
        highScoresList.appendChild(li);
        return;
    }

    scores.slice(0, 5).forEach(entry => {
        const li = createHighScoreItem(entry);
        highScoresList.appendChild(li);
    });
}

/**
 * Handle play again
 */
function handlePlayAgain() {
    startNewGame();
}

/**
 * Handle back to menu
 */
function handleBackToMenu() {
    handleLogout();
}

/**
 * Show error message
 */
function showError(message) {
    alert(message); // Simple for now, could be a toast
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
