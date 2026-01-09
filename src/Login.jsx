import { SPOTIFY_CLIENT_ID } from './utils.js';

const Login = () => {
  const scopes = 'user-top-read';
  const authUrl = `https://accounts.spotify.com/authorize?` +
    new URLSearchParams({
      response_type: 'token',
      client_id: SPOTIFY_CLIENT_ID,
      scope: scopes,
      redirect_uri: 'http://localhost:3000/callback',
      show_dialog: false
    });

  return (
    <div className="login-screen">
      <div className="login-card">
        <h1>🎵 SongRush</h1>
        <p>Guess your favorite songs from tiny previews!</p>
        <a href={authUrl} className="spotify-btn">
          🎧 Login with Spotify
        </a>
        <p className="login-hint">Plays clips from your top tracks</p>
      </div>
    </div>
  );
};

export default Login;
