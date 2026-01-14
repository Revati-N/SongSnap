/**
 * Spotify OAuth Authentication Module
 * Implements Authorization Code Flow with PKCE (no backend required)
 */

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI || window.location.origin;
const SCOPES = [
    'user-read-private',
    'user-library-read',
    'user-top-read'
].join(' ');

const TOKEN_KEY = 'songsnap_token';
const VERIFIER_KEY = 'songsnap_code_verifier';
const EXPIRY_KEY = 'songsnap_token_expiry';
const REFRESH_KEY = 'songsnap_refresh_token';

/**
 * Generate a random string for PKCE code verifier
 */
function generateCodeVerifier() {
    const array = new Uint8Array(64);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

/**
 * Generate SHA256 hash and encode as base64url for PKCE code challenge
 */
async function generateCodeChallenge(verifier) {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    const base64 = btoa(String.fromCharCode(...new Uint8Array(digest)));
    return base64
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

/**
 * Redirect user to Spotify authorization page
 */
export async function redirectToSpotifyAuth() {
    const verifier = generateCodeVerifier();
    const challenge = await generateCodeChallenge(verifier);

    // Store verifier for later use
    localStorage.setItem(VERIFIER_KEY, verifier);

    const params = new URLSearchParams({
        client_id: CLIENT_ID,
        response_type: 'code',
        redirect_uri: REDIRECT_URI,
        scope: SCOPES,
        code_challenge_method: 'S256',
        code_challenge: challenge,
        show_dialog: 'false'
    });

    window.location.href = `https://accounts.spotify.com/authorize?${params}`;
}

/**
 * Handle the OAuth callback and exchange code for tokens
 */
export async function handleCallback() {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const error = params.get('error');

    if (error) {
        throw new Error(`Spotify auth error: ${error}`);
    }

    if (!code) {
        return false; // No callback to handle
    }

    const verifier = localStorage.getItem(VERIFIER_KEY);
    if (!verifier) {
        throw new Error('Missing code verifier');
    }

    // Exchange code for tokens
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            client_id: CLIENT_ID,
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: REDIRECT_URI,
            code_verifier: verifier
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Token exchange failed: ${errorData.error_description || errorData.error}`);
    }

    const data = await response.json();

    // Store tokens
    saveTokens(data);

    // Clean up URL and verifier
    localStorage.removeItem(VERIFIER_KEY);
    window.history.replaceState({}, document.title, window.location.pathname);

    return true;
}

/**
 * Save tokens to localStorage
 */
function saveTokens(data) {
    localStorage.setItem(TOKEN_KEY, data.access_token);
    localStorage.setItem(REFRESH_KEY, data.refresh_token);

    // Calculate expiry time (with 5 minute buffer)
    const expiresAt = Date.now() + (data.expires_in - 300) * 1000;
    localStorage.setItem(EXPIRY_KEY, expiresAt.toString());
}

/**
 * Refresh the access token using refresh token
 */
export async function refreshAccessToken() {
    const refreshToken = localStorage.getItem(REFRESH_KEY);

    if (!refreshToken) {
        throw new Error('No refresh token available');
    }

    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            client_id: CLIENT_ID,
            grant_type: 'refresh_token',
            refresh_token: refreshToken
        })
    });

    if (!response.ok) {
        // Refresh failed, need to re-authenticate
        logout();
        throw new Error('Session expired, please login again');
    }

    const data = await response.json();
    saveTokens(data);

    return data.access_token;
}

/**
 * Get a valid access token, refreshing if necessary
 */
export async function getValidToken() {
    const token = localStorage.getItem(TOKEN_KEY);
    const expiry = parseInt(localStorage.getItem(EXPIRY_KEY) || '0');

    if (!token) {
        return null;
    }

    // Check if token is expired or about to expire
    if (Date.now() >= expiry) {
        try {
            return await refreshAccessToken();
        } catch (e) {
            console.error('Token refresh failed:', e);
            return null;
        }
    }

    return token;
}

/**
 * Check if user is logged in
 */
export function isLoggedIn() {
    return !!localStorage.getItem(TOKEN_KEY);
}

/**
 * Log out user and clear all stored data
 */
export function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(EXPIRY_KEY);
    localStorage.removeItem(VERIFIER_KEY);
}

/**
 * Make an authenticated API request to Spotify
 */
export async function spotifyFetch(endpoint, options = {}) {
    const token = await getValidToken();

    if (!token) {
        throw new Error('Not authenticated');
    }

    const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
        ...options,
        headers: {
            'Authorization': `Bearer ${token}`,
            ...options.headers
        }
    });

    if (response.status === 401) {
        // Token might be invalid, try refreshing
        try {
            const newToken = await refreshAccessToken();
            return fetch(`https://api.spotify.com/v1${endpoint}`, {
                ...options,
                headers: {
                    'Authorization': `Bearer ${newToken}`,
                    ...options.headers
                }
            });
        } catch (e) {
            throw new Error('Authentication failed');
        }
    }

    return response;
}
