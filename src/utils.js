export const SPOTIFY_CLIENT_ID = '789244d326c143f9b6a28ac5c140d22f'; // Replace with your Client ID

export const getToken = () => localStorage.getItem('spotify_token');

export const parseHash = (hash) => {
  const params = new URLSearchParams(hash.substring(1));
  return Object.fromEntries(params);
};

export const getTopTracks = async (token) => {
  const res = await fetch('https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=50', {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  return data.items.filter(track => track.preview_url); // Only tracks with previews
};
