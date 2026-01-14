const CLIENT_ID = '789244d326c143f9b6a28ac5c140d22f'; // Replace with your ID
const REDIRECT_URI = window.location.origin;
const SCOPES = 'user-library-read';

let accessToken = null;
let currentTrack = null;
let currentDifficulty = 1; // seconds

// 1. Handle Login
document.getElementById('login-btn').onclick = () => {
    const url = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPES}&response_type=token&show_dialog=true`;
    window.location.href = url;
};

// 2. Check for Token in URL
window.onload = () => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    accessToken = params.get('access_token');

    if (accessToken) {
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('game-screen').classList.remove('hidden');
        loadNewSong();
    }
};

// 3. Game Logic
async function loadNewSong() {
    const response = await fetch('https://api.spotify.com/v1/me/tracks?limit=50', {
        headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    const data = await response.json();
    const items = data.items.filter(item => item.track.preview_url); // Only tracks with previews
    currentTrack = items[Math.floor(Math.random() * items.length)].track;
    console.log("Cheater! The song is:", currentTrack.name); 
}

// Play only the allowed time
document.getElementById('play-clip').onclick = () => {
    if (!currentTrack) return;
    const audio = new Audio(currentTrack.preview_url);
    audio.play();
    setTimeout(() => {
        audio.pause();
    }, currentDifficulty * 1000);
};

// Handle Difficulty Selection
document.querySelectorAll('.time-btn').forEach(btn => {
    btn.onclick = (e) => {
        currentDifficulty = parseInt(e.target.dataset.time);
        // Visual feedback for selected button
    };
});

// Check Guess
document.getElementById('submit-guess').onclick = () => {
    const userGuess = document.getElementById('guess-input').value.toLowerCase();
    const actualTitle = currentTrack.name.toLowerCase();

    if (actualTitle.includes(userGuess) && userGuess.length > 3) {
        document.getElementById('feedback').innerText = "✅ Correct!";
        loadNewSong();
    } else {
        document.getElementById('feedback').innerText = "❌ Try again or use more time!";
    }
};