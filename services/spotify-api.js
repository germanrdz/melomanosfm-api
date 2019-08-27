const Spotify = require('spotify-web-api-node');

// Initializing
const spotifyApi = new Spotify({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_CALLBACK_URL,
});

module.exports = spotifyApi;
