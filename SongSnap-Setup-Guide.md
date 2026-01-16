# SongSnap - Music Guessing Game

A fun, interactive web game where you log in with Spotify and guess songs based on progressively longer audio previews (1s, 3s, 5s, 10s). All data stored client-side only—no server, no cloud costs.

## 🎮 Game Features

- **Spotify OAuth Login** - Seamless authentication with your Spotify account
- **Progressive Difficulty** - 4 rounds with increasing audio duration: 1s → 3s → 5s → 10s
- **Your Top Tracks** - Plays songs from your Spotify "Top Tracks"
- **Multiple Choice** - 4 answer options per round (including the correct answer)
- **Score Tracking** - Points awarded based on time difficulty
- **Client-Side Only** - No server, no data storage, no costs
- **Beautiful UI** - Modern, responsive design with smooth animations
- **Difficulty Modifier** - Points = 100 / time_allowed (1s = 100pts, 10s = 10pts)

## 📋 Prerequisites

Before you start, you need:

1. **Node.js** installed (for local testing) - https://nodejs.org/
2. **Git** installed - https://git-scm.com/
3. **A Spotify Account** (free or premium)
4. **A Spotify Developer App** (created below)

## 🔧 Step 1: Create Spotify Developer App

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Click **"Log In"** or create a free Spotify account
3. Accept the terms and create an app with any name (e.g., "SongSnap")
4. Accept terms → Your app is created
5. You'll see **Client ID** and **Client Secret** - save these!
6. Click **"Edit Settings"**
7. Add Redirect URI: `http://localhost:3000/` (for local) and `https://<your-github-username>.github.io/SongSnap/` (for GitHub Pages)
   - Replace `<your-github-username>` with your actual GitHub username
8. Save settings

## 📁 Step 2: Set Up GitHub Repository

### Method A: Fork and Clone

1. Go to this repository: https://github.com/yourusername/SongSnap (create a new repo named "SongSnap")
2. Clone it locally:
   ```bash
   git clone https://github.com/<your-username>/SongSnap.git
   cd SongSnap
   ```

### Method B: Create from Scratch

1. Create new folder:
   ```bash
   mkdir SongSnap
   cd SongSnap
   ```

2. Initialize git:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<your-username>/SongSnap.git
   git push -u origin main
   ```

## 📝 Step 3: Add Project Files

Your project structure should look like:

```
SongSnap/
├── index.html (main game file)
├── README.md (project description)
├── .gitignore (git ignore file)
└── docs/ (optional, for GitHub Pages)
```

### 3a. Create `.gitignore`

```
node_modules/
.DS_Store
.env.local
dist/
```

### 3b. Update `index.html`

Replace the `CLIENT_ID` value in the HTML file with your actual Spotify Client ID from Step 1.

In the HTML file, find this line:
```javascript
const CLIENT_ID = 'YOUR_CLIENT_ID_HERE';
```

Replace `'YOUR_CLIENT_ID_HERE'` with your actual Client ID (looks like: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4`)

### 3c. Create `README.md`

See README template below.

## 🚀 Step 4: Local Testing

### Start Local Server

```bash
# Using Python 3
python -m http.server 3000

# Or using Node.js
npx http-server -p 3000
```

Visit `http://localhost:3000` in your browser.

### Test the Game

1. Click **"Login with Spotify"**
2. Authorize the app in Spotify popup
3. Wait for top tracks to load (may take 5-10 seconds)
4. Start playing!

## 🌐 Step 5: Deploy to GitHub Pages

### Enable GitHub Pages

1. Go to your GitHub repository settings
2. Scroll to **"GitHub Pages"** section
3. Set Source: `main` branch, `/ (root)` folder
4. Save

### Push Code to GitHub

```bash
git add .
git commit -m "Add SongSnap game"
git push origin main
```

Your game will be live at: `https://<your-username>.github.io/SongSnap/`

**Important:** Update the Redirect URI in Spotify Developer Dashboard to match your GitHub Pages URL (Step 1, step 7).

## 🎯 How to Play

1. **Login** - Click "Login with Spotify" button
2. **Authorize** - Allow app to access your top tracks
3. **Game Rounds**:
   - **Round 1 (1 sec)** - Hear 1 second of song, pick answer (100 points if correct)
   - **Round 2 (3 secs)** - Hear 3 seconds (33 points if correct)
   - **Round 3 (5 secs)** - Hear 5 seconds (20 points if correct)
   - **Round 4 (10 secs)** - Hear 10 seconds (10 points if correct)
4. **Score** - Your total score appears at the top
5. **Next Song** - Click "Next Song" after each guess
6. **Play Again** - Refresh page or click "Play Again" button

## 🔒 Privacy & Security

- ✅ **No Server** - Game runs entirely in your browser
- ✅ **No Database** - No data saved anywhere
- ✅ **No Cloud Costs** - All free
- ✅ **No Tracking** - Spotify access token only stored in browser memory (cleared on refresh)
- ✅ **No User Data Saved** - Score is only in-browser, lost on refresh

## 🐛 Troubleshooting

### "Redirect URI mismatch" Error
- Ensure the Redirect URI in Spotify Developer Dashboard exactly matches your current URL
- For localhost: `http://localhost:3000/`
- For GitHub Pages: `https://<username>.github.io/SongSnap/`

### "No audio to play"
- Some songs may not have preview clips available from Spotify
- Game will skip to next song automatically
- Try clicking "Next Song" manually

### Songs Not Loading
- First load may take 5-10 seconds
- Check browser console (F12) for errors
- Ensure you're logged into Spotify account with saved tracks

### CORS Errors
- Spotify API handles this - shouldn't occur
- If it does, check Client ID is correct

## 📱 Browser Support

- ✅ Chrome/Chromium (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ⚠️ Mobile browsers (works but small interface)

## 🎨 Customization

### Modify Difficulty
In `index.html`, find the `GAME_ROUNDS` array and change durations:
```javascript
const GAME_ROUNDS = [
  { duration: 1, points: 100 },
  { duration: 3, points: 33 },
  { duration: 5, points: 20 },
  { duration: 10, points: 10 }
];
```

### Change Colors
Modify the CSS variables in the `<style>` section:
```css
--primary-color: #1DB954;
--secondary-color: #191414;
--accent-color: #1ed760;
```

### Adjust Number of Choices
Find the code that generates answer options and modify the `4` value:
```javascript
const NUM_CHOICES = 4; // Change to 3, 5, etc.
```

## 📚 API Reference

This game uses:
- **Spotify Web API** - OAuth 2.0 authorization and user top tracks
- **HTML5 Audio** - For playing preview clips
- **LocalStorage** - For temporary session state only

No external libraries required!

## 🤝 Contributing

Want to improve SongSnap? 
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/awesome-feature`)
3. Commit changes (`git commit -m 'Add awesome feature'`)
4. Push to branch (`git push origin feature/awesome-feature`)
5. Open a Pull Request

## 📄 License

MIT License - Feel free to use for personal or commercial projects

## 🎉 Have Fun!

SongSnap is meant to be a fun game. If you enjoy music and Spotify, you'll love this!

Questions? Check the troubleshooting section or create an issue on GitHub.

---

**Last Updated:** January 2026
**Version:** 1.0.0
