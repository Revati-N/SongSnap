/**
 * Scoring System
 * Points based on how quickly you guess the song
 */

// Time tiers with their corresponding points
export const TIME_TIERS = [
    { seconds: 1, points: 1000, label: '1s', difficulty: 'Expert' },
    { seconds: 3, points: 500, label: '3s', difficulty: 'Hard' },
    { seconds: 5, points: 250, label: '5s', difficulty: 'Medium' },
    { seconds: 10, points: 100, label: '10s', difficulty: 'Easy' }
];

/**
 * Get points for a correct guess at the given tier index
 */
export function getPointsForTier(tierIndex) {
    if (tierIndex < 0 || tierIndex >= TIME_TIERS.length) {
        return 0;
    }
    return TIME_TIERS[tierIndex].points;
}

/**
 * Get the seconds for a given tier
 */
export function getSecondsForTier(tierIndex) {
    if (tierIndex < 0 || tierIndex >= TIME_TIERS.length) {
        return TIME_TIERS[TIME_TIERS.length - 1].seconds;
    }
    return TIME_TIERS[tierIndex].seconds;
}

/**
 * Get tier info by index
 */
export function getTierInfo(tierIndex) {
    return TIME_TIERS[tierIndex] || null;
}

/**
 * Calculate streak bonus
 */
export function calculateStreakBonus(streak) {
    if (streak < 2) return 0;
    if (streak < 5) return 50 * streak;
    if (streak < 10) return 100 * streak;
    return 150 * streak;
}

/**
 * Calculate total game score with bonuses
 */
export function calculateFinalScore(roundScores, maxStreak) {
    const baseScore = roundScores.reduce((sum, score) => sum + score, 0);
    const streakBonus = calculateStreakBonus(maxStreak);
    return baseScore + streakBonus;
}
