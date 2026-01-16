# SongSnap 🎵

**A fun, interactive music guessing game with Spotify integration**

Guess songs in real-time by listening to progressively longer audio clips (1s → 3s → 5s → 10s). All game data stays client-side—no server, no database, completely free to host.

![Game Screenshot](#) | **[Play Now!](https://YOUR_USERNAME.github.io/SongSnap)** (after setup)

## 🎮 Features

✨ **Spotify OAuth Login** - Secure login with your Spotify account  
🎵 **Your Personal Music** - Game uses YOUR top Spotify tracks  
⏱️ **Progressive Difficulty** - 4 rounds with increasing audio duration  
🏆 **Score System** - Earn points based on difficulty (harder = more points)  
💾 **Client-Side Only** - No servers, no data saved, completely free  
🎨 **Beautiful UI** - Modern Spotify-inspired dark theme  
📱 **Responsive Design** - Works on desktop, tablet, and mobile  
⚡ **No Dependencies** - Vanilla HTML/CSS/JavaScript, no frameworks needed  

## 🚀 Quick Start

### 1. Create Spotify Developer App (5 minutes)

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Log in (or create free Spotify account)
3. Click "Create an App"
4. Accept terms and name it "SongSnap"
5. Copy your **Client ID**
6. Click "Edit Settings"
7. Add Redirect URI: `http://localhost:3000/` (for testing)
8. Save

### 2. Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/SongSnap.git
cd SongSnap
```

### 3. Add Your Spotify Client ID

Edit `index.html` and find this line (around line 530):

```javascript
const CLIENT_ID = 'YOUR_CLIENT_ID_HERE';
```

Replace `'YOUR_CLIENT_ID_HERE'` with your actual Client ID from Step 1.

### 4. Test Locally

```bash
# Using Python 3
python -m http.server 3000

# Or using Node.js
npx http-server -p 3000
```

Visit `http://localhost:3000` in your browser.

### 5. Deploy to GitHub Pages

1. In GitHub repo settings, enable GitHub Pages (Source: main branch, / root)
2. Update Spotify app redirect URI to: `https://YOUR_USERNAME.github.io/SongSnap/`
3. Push to main: `git push origin main`
4. Visit `https://YOUR_USERNAME.github.io/SongSnap/`

## 🎯 How to Play

1. **Login** → Click "Login with Spotify"
2. **Authorize** → Allow app to read your top tracks
3. **Listen** → Hear a song preview for 1, 3, 5, or 10 seconds
4. **Guess** → Pick from 4 artists
5. **Score** → Get points based on difficulty
6. **Repeat** → 4 rounds total with increasing audio duration

**Scoring:**
- 1 second = 100 points
- 3 seconds = 33 points  
- 5 seconds = 20 points
- 10 seconds = 10 points

## 📋 Project Structure

```
SongSnap/
├── index.html           # Main game file (complete app)
├── README.md            # This file
├── .gitignore          # Git ignore file
└── docs/               # Optional: GitHub Pages custom domain
```

Everything is in **one HTML file**. No build process, no dependencies, no server needed.

## 🔐 Privacy & Security

✅ **No Server** - All code runs in your browser  
✅ **No Database** - No data stored anywhere  
✅ **No Backend** - Deployed as static files on GitHub Pages  
✅ **No Tracking** - Spotify token only lives in memory  
✅ **No Cost** - Completely free to host and use  

## 🔧 Customization

### Change Difficulty Levels

In `index.html`, find `GAME_ROUNDS` and modify:

```javascript
const GAME_ROUNDS = [
  { duration: 1, points: 100 },
  { duration: 3, points: 33 },
  { duration: 5, points: 20 },
  { duration: 10, points: 10 }
];
```

### Change Number of Answer Choices

Find `NUM_CHOICES` and change:

```javascript
const NUM_CHOICES = 4; // Change to 3, 5, 6, etc.
```

### Modify Colors

Edit CSS variables in `<style>`:

```css
--primary-color: #1DB954;      /* Spotify green */
--secondary-color: #191414;    /* Dark background */
--accent-color: #1ed760;       /* Bright green */
```

## 🐛 Troubleshooting

### "Redirect URI mismatch"
- Ensure Spotify app settings match your current URL exactly
- **Local:** `http://localhost:3000/`
- **GitHub Pages:** `https://YOUR_USERNAME.github.io/SongSnap/`

### Songs not loading
- Some Spotify tracks don't have 30-second previews
- Game auto-skips them
- Click "Skip Song" to try another

### Client ID error
- Make sure you replaced `'YOUR_CLIENT_ID_HERE'` in index.html
- Check for typos in Client ID
- Verify Client ID is from correct Spotify app

### CORS errors
- Shouldn't happen with Spotify API
- Clear browser cache and try again
- Check browser console (F12) for specific error

### Audio not playing
- Check volume is unmuted
- Try clicking "Replay" button
- Some browsers require user interaction first

## 🌍 Browser Support

| Browser | Support |
|---------|---------|
| Chrome | ✅ Full |
| Firefox | ✅ Full |
| Safari | ✅ Full |
| Edge | ✅ Full |
| Mobile Chrome | ✅ Works |
| Mobile Safari | ✅ Works |

## 📚 Technologies Used

- **Spotify Web API** - User authentication & track data
- **HTML5 Audio API** - Preview playback
- **Vanilla JavaScript** - No frameworks or libraries
- **CSS3** - Modern styling with gradients & animations
- **GitHub Pages** - Free static hosting

## 🎨 Design Inspiration

UI inspired by Spotify's dark theme with custom game elements.

## 🤝 Contributing

Improvements welcome!

1. Fork the repo
2. Create feature branch: `git checkout -b feature/awesome`
3. Commit: `git commit -m 'Add awesome feature'`
4. Push: `git push origin feature/awesome`
5. Open Pull Request

## 📝 License

MIT License - Use freely for personal or commercial projects

```
MIT License

Copyright (c) 2026

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

## 🎉 Enjoy the Game!

Have fun guessing your favorite songs! 

**Questions?** Check the troubleshooting section or open an issue on GitHub.

---

**Made with ❤️ for music lovers**

Last Updated: January 2026 | Version 1.0.0
