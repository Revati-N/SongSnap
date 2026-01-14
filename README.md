# 🎵 SongSnap - Spotify Song Guessing Game

Test your music knowledge! Guess songs from your Spotify library based on short audio clips. The faster you guess, the more points you earn!

![SongSnap Game](https://img.shields.io/badge/Powered%20By-Spotify-1DB954?style=for-the-badge&logo=spotify)

## 🎮 How to Play

1. **Login** with your Spotify account
2. **Listen** to a short clip of a song from your library
3. **Guess** the song name before time runs out
4. **Score points** based on how quickly you guess:
   - 🏆 **1 second** = 1000 points (Expert!)
   - 🥇 **3 seconds** = 500 points (Hard)
   - 🥈 **5 seconds** = 250 points (Medium)
   - 🥉 **10 seconds** = 100 points (Easy)

5. Complete 10 rounds and try to beat your high score!

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- A Spotify account (free or premium)

### Step 1: Create a Spotify App

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Log in with your Spotify account
3. Click **"Create App"**
4. Fill in the details:
   - **App name**: `SongSnap` (or any name you like)
   - **App description**: `Song guessing game`
   - **Redirect URI**: `http://localhost:5173`
   - Check the box to agree to terms
5. Click **"Save"**
6. In your new app, click **"Settings"**
7. Copy your **Client ID** (you'll need this!)

### Step 2: Configure the Project

1. Navigate to the project folder:
   ```bash
   cd SongSnap
   ```

2. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

3. Open `.env` and add your Spotify Client ID:
   ```
   VITE_SPOTIFY_CLIENT_ID=your_client_id_here
   VITE_REDIRECT_URI=http://localhost:5173
   ```

### Step 3: Install & Run

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser to [http://localhost:5173](http://localhost:5173)

4. Click **"Login with Spotify"** and enjoy! 🎉

## 📁 Project Structure

```
SongSnap/
├── index.html              # Main HTML entry
├── vite.config.js          # Vite configuration
├── package.json            # Dependencies
├── .env                    # Your Spotify credentials (create from .env.example)
├── .env.example            # Template for environment variables
├── src/
│   ├── main.js             # App initialization
│   ├── styles/
│   │   └── index.css       # All styles
│   ├── auth/
│   │   └── spotify.js      # OAuth PKCE authentication
│   ├── game/
│   │   ├── engine.js       # Core game logic
│   │   ├── audio.js        # Audio playback control
│   │   └── scoring.js      # Scoring system
│   ├── ui/
│   │   ├── screens.js      # Screen management
│   │   ├── components.js   # UI components
│   │   └── animations.js   # Visual effects
│   └── storage/
│       └── local.js        # localStorage wrapper
└── public/
    └── favicon.svg         # App icon
```

## 🔒 Privacy

- **All data stays on your device** - no cloud storage, no tracking
- Authentication tokens are stored in your browser's localStorage
- High scores and game history are saved locally
- No data is ever sent to external servers (except Spotify for authentication)

## 🛠️ Development Commands

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🌐 Deploy to GitHub Pages

### One-Time Setup

1. **Update Spotify App Redirect URI**:
   - Go to your app on [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   - Click **Settings** → **Edit**
   - Add a new Redirect URI: `https://YOUR_USERNAME.github.io/SongSnap/`
   - Save changes

2. **Update `vite.config.js`** (if your repo name is different):
   ```js
   base: process.env.GITHUB_PAGES ? '/YOUR-REPO-NAME/' : '/',
   ```

3. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/SongSnap.git
   git push -u origin main
   ```

4. **Enable GitHub Pages**:
   - Go to your repo → **Settings** → **Pages**
   - Under "Build and deployment", select **GitHub Actions**
   - The included workflow (`.github/workflows/deploy.yml`) will auto-deploy

5. **Set Environment Variable** (for Client ID):
   - Go to repo **Settings** → **Secrets and variables** → **Actions**
   - Click **Variables** tab → **New repository variable**
   - Name: `VITE_SPOTIFY_CLIENT_ID`
   - Value: Your Spotify Client ID

> ⚠️ **Important**: For GitHub Pages, you can't use `.env` files. You have two options:
> 
> **Option A (Recommended)**: Hardcode your Client ID temporarily in `src/auth/spotify.js`:
> ```js
> const CLIENT_ID = 'your_actual_client_id_here';
> ```
> 
> **Option B**: Use GitHub Secrets with a modified build process (more complex)

## ❓ FAQ

### Why do some songs not have audio?
Spotify doesn't provide preview clips for all songs. The game automatically filters to only use songs with available previews.

### Do I need Spotify Premium?
No! SongSnap uses Spotify's 30-second preview URLs, which are available for free accounts.

### Can I use this on mobile?
Yes! The interface is fully responsive and works on phones and tablets.

### Why can't I see all my playlists?
The game uses your **Top Tracks** and **Saved/Liked Songs** to ensure you're guessing songs you actually know. Playlist support may be added in future updates.

## 🎨 Credits

Built with:
- [Vite](https://vitejs.dev/) - Lightning fast build tool
- [Spotify Web API](https://developer.spotify.com/documentation/web-api/) - Music data and previews
- [Inter Font](https://fonts.google.com/specimen/Inter) - Clean typography

## 📄 License

MIT License - feel free to modify and share!

---

**Made with ❤️ and 🎵**
