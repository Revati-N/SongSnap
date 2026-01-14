/**
 * Game Engine
 * Core game logic - manages rounds, tracks, and game state
 */

import { spotifyFetch } from '../auth/spotify.js';
import { audioController } from './audio.js';
import { TIME_TIERS, getPointsForTier, getSecondsForTier } from './scoring.js';
import { saveHighScore, saveGameHistory } from '../storage/local.js';

const ROUNDS_PER_GAME = 10;

class GameEngine {
    constructor() {
        this.reset();
    }

    /**
     * Reset game state
     */
    reset() {
        this.tracks = [];
        this.gameTracks = [];
        this.currentRoundIndex = 0;
        this.currentTierIndex = 0;
        this.score = 0;
        this.roundScores = [];
        this.correctCount = 0;
        this.currentStreak = 0;
        this.bestStreak = 0;
        this.hasPlayedCurrentTier = false;
        this.isRoundComplete = false;
        this.roundResults = [];
    }

    /**
     * Initialize game by fetching user's tracks
     */
    async initialize(onProgress) {
        this.reset();

        if (onProgress) onProgress('Fetching your top tracks...');

        // Get user's top tracks
        const topTracks = await this.fetchTopTracks();

        if (onProgress) onProgress('Fetching your saved tracks...');

        // Get some saved tracks too
        const savedTracks = await this.fetchSavedTracks();

        // Combine and filter tracks that have preview URLs
        const allTracks = [...topTracks, ...savedTracks];
        this.tracks = allTracks.filter(track => track.preview_url);

        // Remove duplicates by track ID
        const seen = new Set();
        this.tracks = this.tracks.filter(track => {
            if (seen.has(track.id)) return false;
            seen.add(track.id);
            return true;
        });

        if (this.tracks.length < ROUNDS_PER_GAME) {
            throw new Error(`Not enough tracks with previews. Found ${this.tracks.length}, need at least ${ROUNDS_PER_GAME}.`);
        }

        return this.tracks;
    }

    /**
     * Fetch user's top tracks from Spotify
     */
    async fetchTopTracks() {
        try {
            const response = await spotifyFetch('/me/top/tracks?limit=50&time_range=medium_term');
            if (!response.ok) throw new Error('Failed to fetch top tracks');
            const data = await response.json();
            return data.items || [];
        } catch (e) {
            console.warn('Could not fetch top tracks:', e);
            return [];
        }
    }

    /**
     * Fetch user's saved/liked tracks
     */
    async fetchSavedTracks() {
        try {
            const response = await spotifyFetch('/me/tracks?limit=50');
            if (!response.ok) throw new Error('Failed to fetch saved tracks');
            const data = await response.json();
            return (data.items || []).map(item => item.track);
        } catch (e) {
            console.warn('Could not fetch saved tracks:', e);
            return [];
        }
    }

    /**
     * Start a new game
     */
    startGame() {
        this.reset();

        // Select random tracks for this game
        this.gameTracks = this.shuffleArray([...this.tracks]).slice(0, ROUNDS_PER_GAME);

        return {
            totalRounds: ROUNDS_PER_GAME,
            currentRound: 1
        };
    }

    /**
     * Get current round data
     */
    getCurrentRound() {
        if (this.currentRoundIndex >= this.gameTracks.length) {
            return null;
        }

        const track = this.gameTracks[this.currentRoundIndex];
        const tier = TIME_TIERS[this.currentTierIndex];

        return {
            roundNumber: this.currentRoundIndex + 1,
            totalRounds: ROUNDS_PER_GAME,
            track: track,
            tierIndex: this.currentTierIndex,
            tier: tier,
            score: this.score,
            hasPlayed: this.hasPlayedCurrentTier,
            isComplete: this.isRoundComplete
        };
    }

    /**
     * Load audio for current track
     */
    async loadCurrentTrack() {
        const round = this.getCurrentRound();
        if (!round) throw new Error('No current round');

        await audioController.load(round.track.preview_url);
    }

    /**
     * Play the current tier's audio clip
     */
    playCurrentTier(onUpdate, onComplete) {
        const tier = TIME_TIERS[this.currentTierIndex];
        this.hasPlayedCurrentTier = true;

        audioController.playForDuration(tier.seconds, onUpdate, onComplete);
    }

    /**
     * Stop audio playback
     */
    stopAudio() {
        audioController.stop();
    }

    /**
     * Submit a guess for the current round
     */
    submitGuess(guessTrackId) {
        const round = this.getCurrentRound();
        if (!round || this.isRoundComplete) {
            return { valid: false };
        }

        const isCorrect = guessTrackId === round.track.id;
        let pointsEarned = 0;

        if (isCorrect) {
            pointsEarned = getPointsForTier(this.currentTierIndex);
            this.score += pointsEarned;
            this.correctCount++;
            this.currentStreak++;
            this.bestStreak = Math.max(this.bestStreak, this.currentStreak);
        } else {
            this.currentStreak = 0;
        }

        this.roundScores.push(pointsEarned);
        this.isRoundComplete = true;
        this.roundResults.push({
            track: round.track,
            correct: isCorrect,
            guessedAt: this.currentTierIndex,
            points: pointsEarned
        });

        audioController.stop();

        return {
            valid: true,
            correct: isCorrect,
            points: pointsEarned,
            totalScore: this.score,
            track: round.track,
            tierIndex: this.currentTierIndex
        };
    }

    /**
     * Skip to next time tier (reveal more audio)
     */
    revealMore() {
        if (this.currentTierIndex >= TIME_TIERS.length - 1) {
            // No more tiers, mark as failed
            this.isRoundComplete = true;
            this.currentStreak = 0;
            this.roundScores.push(0);

            const round = this.getCurrentRound();
            this.roundResults.push({
                track: round.track,
                correct: false,
                guessedAt: -1,
                points: 0
            });

            audioController.stop();

            return {
                hasMore: false,
                track: round.track
            };
        }

        this.currentTierIndex++;
        this.hasPlayedCurrentTier = false;

        return {
            hasMore: true,
            newTier: TIME_TIERS[this.currentTierIndex],
            tierIndex: this.currentTierIndex
        };
    }

    /**
     * Move to next round
     */
    nextRound() {
        this.currentRoundIndex++;
        this.currentTierIndex = 0;
        this.hasPlayedCurrentTier = false;
        this.isRoundComplete = false;

        if (this.currentRoundIndex >= ROUNDS_PER_GAME) {
            return { gameOver: true };
        }

        return {
            gameOver: false,
            round: this.getCurrentRound()
        };
    }

    /**
     * End the game and get final results
     */
    endGame() {
        const results = {
            score: this.score,
            correctCount: this.correctCount,
            totalRounds: ROUNDS_PER_GAME,
            accuracy: Math.round((this.correctCount / ROUNDS_PER_GAME) * 100),
            bestStreak: this.bestStreak,
            rounds: this.roundResults
        };

        // Save to local storage
        saveHighScore(this.score, this.correctCount, ROUNDS_PER_GAME);
        saveGameHistory({
            score: this.score,
            correct: this.correctCount,
            total: ROUNDS_PER_GAME,
            rounds: this.roundResults.map(r => ({
                trackId: r.track.id,
                trackName: r.track.name,
                artist: r.track.artists[0]?.name,
                correct: r.correct,
                points: r.points
            }))
        });

        return results;
    }

    /**
     * Get all available tracks for autocomplete
     */
    getAllTracks() {
        return this.tracks;
    }

    /**
     * Search tracks for autocomplete
     */
    searchTracks(query) {
        if (!query || query.length < 2) return [];

        const lowerQuery = query.toLowerCase();

        return this.tracks
            .filter(track => {
                const trackName = track.name.toLowerCase();
                const artistName = track.artists[0]?.name.toLowerCase() || '';
                return trackName.includes(lowerQuery) || artistName.includes(lowerQuery);
            })
            .slice(0, 8);
    }

    /**
     * Shuffle array (Fisher-Yates algorithm)
     */
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    /**
     * Check if audio is currently playing
     */
    isPlaying() {
        return audioController.isPlaying();
    }
}

// Export singleton instance
export const gameEngine = new GameEngine();
