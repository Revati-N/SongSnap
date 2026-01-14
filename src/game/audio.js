/**
 * Audio Playback Controller
 * Handles playing song previews with timed stops
 */

class AudioController {
    constructor() {
        this.audio = new Audio();
        this.audio.crossOrigin = 'anonymous';
        this.playTimeout = null;
        this.updateInterval = null;
        this.onTimeUpdate = null;
        this.onEnded = null;
        this.startTime = 0;
        this.maxDuration = 0;
    }

    /**
     * Load a preview URL
     */
    load(url) {
        return new Promise((resolve, reject) => {
            if (!url) {
                reject(new Error('No preview URL available'));
                return;
            }

            this.stop();
            this.audio.src = url;

            this.audio.oncanplaythrough = () => resolve();
            this.audio.onerror = () => reject(new Error('Failed to load audio'));

            this.audio.load();
        });
    }

    /**
     * Play audio for a specific duration
     */
    playForDuration(seconds, onUpdate, onComplete) {
        this.stop();
        this.maxDuration = seconds;
        this.startTime = this.audio.currentTime || 0;
        this.onTimeUpdate = onUpdate;
        this.onEnded = onComplete;

        // Start from beginning if starting fresh
        if (this.startTime === 0 || this.audio.ended) {
            this.audio.currentTime = 0;
            this.startTime = 0;
        }

        const endTime = this.startTime + seconds;

        // Play the audio
        this.audio.play().catch(err => {
            console.error('Playback failed:', err);
        });

        // Update progress every 100ms
        this.updateInterval = setInterval(() => {
            const elapsed = this.audio.currentTime - this.startTime;
            if (this.onTimeUpdate) {
                this.onTimeUpdate(elapsed, this.maxDuration);
            }
        }, 100);

        // Stop after duration
        this.playTimeout = setTimeout(() => {
            this.pause();
            if (this.onEnded) {
                this.onEnded();
            }
        }, seconds * 1000);
    }

    /**
     * Pause playback
     */
    pause() {
        this.audio.pause();
        this.clearTimers();
    }

    /**
     * Stop and reset playback
     */
    stop() {
        this.audio.pause();
        this.audio.currentTime = 0;
        this.startTime = 0;
        this.clearTimers();
    }

    /**
     * Clear all timers
     */
    clearTimers() {
        if (this.playTimeout) {
            clearTimeout(this.playTimeout);
            this.playTimeout = null;
        }
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }

    /**
     * Get current playback position
     */
    getCurrentTime() {
        return this.audio.currentTime;
    }

    /**
     * Check if audio is playing
     */
    isPlaying() {
        return !this.audio.paused && !this.audio.ended;
    }

    /**
     * Set volume (0-1)
     */
    setVolume(volume) {
        this.audio.volume = Math.max(0, Math.min(1, volume));
    }

    /**
     * Cleanup
     */
    destroy() {
        this.stop();
        this.audio.src = '';
    }
}

// Export singleton instance
export const audioController = new AudioController();
