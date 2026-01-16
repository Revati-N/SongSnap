# SongSnap - Quick Setup Checklist ✅

## Complete Setup in 15 Minutes

### ✅ Step 1: Spotify Developer Setup (5 min)
- [ ] Go to https://developer.spotify.com/dashboard
- [ ] Create free Spotify account (if needed)
- [ ] Create new app named "SongSnap"
- [ ] Accept terms
- [ ] Copy **Client ID** (save this!)
- [ ] Click "Edit Settings"
- [ ] Add Redirect URIs:
  - [ ] `http://localhost:3000/` (for local testing)
  - [ ] `https://YOUR_GITHUB_USERNAME.github.io/SongSnap/` (for GitHub Pages)
- [ ] Save settings

### ✅ Step 2: Create GitHub Repository (3 min)
- [ ] Create new GitHub repo named "SongSnap"
- [ ] Clone to your computer: `git clone https://github.com/YOUR_USERNAME/SongSnap.git`
- [ ] `cd SongSnap`

### ✅ Step 3: Add Project Files (2 min)
- [ ] Copy `index.html` to SongSnap folder
- [ ] Copy `README.md` to SongSnap folder
- [ ] Copy `.gitignore` to SongSnap folder

### ✅ Step 4: Configure Client ID (1 min)
- [ ] Open `index.html` in text editor
- [ ] Find: `const CLIENT_ID = 'YOUR_CLIENT_ID_HERE';`
- [ ] Replace with your actual Spotify Client ID
- [ ] Save file

### ✅ Step 5: Test Locally (2 min)
- [ ] Open terminal in SongSnap folder
- [ ] Run: `python -m http.server 3000` (or `npx http-server -p 3000`)
- [ ] Open browser: `http://localhost:3000`
- [ ] Click "Login with Spotify"
- [ ] Authorize app
- [ ] Songs load? ✅ Success!

### ✅ Step 6: Push to GitHub (2 min)
```bash
git add .
git commit -m "Initial SongSnap setup"
git push origin main
```

### ✅ Step 7: Enable GitHub Pages (1 min)
- [ ] Go to repo Settings
- [ ] Scroll to "GitHub Pages"
- [ ] Source: `main` branch, `/ (root)` folder
- [ ] Click Save
- [ ] Wait 2-3 minutes for deployment

### ✅ Step 8: Live! 🎉
- [ ] Visit: `https://YOUR_USERNAME.github.io/SongSnap/`
- [ ] Share with friends!

---

## 🔍 Verification

After setup, verify:
- ✅ Game loads without errors
- ✅ Login button appears
- ✅ Spotify popup opens on login
- ✅ Game starts after authorization
- ✅ Songs load with album art
- ✅ Audio buttons work (Play, Pause, Replay)
- ✅ Can select answers
- ✅ Score increases
- ✅ All 4 rounds play

---

## 📱 Test on Different Devices

- [ ] Desktop Chrome
- [ ] Desktop Firefox
- [ ] Mobile Safari
- [ ] Mobile Chrome

---

## 🆘 Common Issues & Fixes

| Problem | Solution |
|---------|----------|
| "Redirect URI mismatch" | Check URL matches Spotify settings exactly |
| "Invalid Client ID" | Verify you replaced `YOUR_CLIENT_ID_HERE` correctly |
| Songs don't load | Ensure Spotify account has top tracks; wait 10 seconds |
| Audio won't play | Try different browser; check audio isn't muted |
| GitHub Pages blank | Enable in repo settings; wait 5 minutes; clear cache |

---

## 💾 File Checklist

Your repo should contain:

```
SongSnap/
├── index.html          ✅ Main game (with CLIENT_ID set)
├── README.md           ✅ Documentation
├── .gitignore         ✅ Git ignore rules
└── (no other files needed!)
```

---

## 🎯 Success Indicators

✅ **Local testing works** - Game playable at `http://localhost:3000`
✅ **GitHub Pages live** - Game accessible at `https://github.com/YOUR_USERNAME/SongSnap`
✅ **Can login** - Spotify OAuth popup works
✅ **Tracks load** - Your top songs appear
✅ **Game plays** - Can guess songs, score increases

---

## 🚀 Next Steps

After successful setup:
1. **Customize colors** - Edit CSS variables in `<style>` section
2. **Adjust difficulty** - Modify `GAME_ROUNDS` array
3. **Share link** - Tell friends to play!
4. **Add features** - Fork and submit pull requests

---

## 📚 Resources

- [Spotify Developer Docs](https://developer.spotify.com/documentation/web-api)
- [GitHub Pages Help](https://docs.github.com/en/pages)
- [HTML5 Audio API](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio)

---

**Questions?** Check README.md troubleshooting section or open a GitHub issue.

**Have fun! 🎵**
