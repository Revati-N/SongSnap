import { useState, useEffect } from 'react';
import Login from './Login.jsx';
import Game from './Game.jsx';
import { getToken, getTopTracks, parseHash } from './utils.js';

function App() {
  const [token, setToken] = useState(localStorage.getItem('spotify_token'));
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [highScore, setHighScore] = useState(localStorage.getItem('highScore') || 0);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const { access_token } = parseHash(hash);
      if (access_token) {
        localStorage.setItem('spotify_token', access_token);
        setToken(access_token);
        window.history.replaceState({}, document.title, '/');
      }
    }
  }, []);

  const loadTracks = async () => {
    setLoading(true);
    try {
      const userTracks = await getTopTracks(token);
      setTracks(userTracks);
      localStorage.setItem('userTracks', JSON.stringify(userTracks));
    } catch (e) {
      alert('Failed to load tracks. Try logging in again.');
    }
    setLoading(false);
  };

  return (
    <div className="app">
      {!token ? (
        <Login />
      ) : (
        <Game 
          token={token}
          tracks={tracks}
          loadTracks={loadTracks}
          loading={loading}
          highScore={highScore}
          setHighScore={setHighScore}
        />
      )}
    </div>
  );
}

export default App;
