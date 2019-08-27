const express = require('express');
const Spotify = require('spotify-web-api-node');
const auth = require('../middleware/auth');

const router = express.Router();

// Initializing
const spotifyApi = new Spotify({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_CALLBACK_URL,
});

router.get('/spotify/my-playlists', auth, async (req, res) => {
  const userId = req.user.spotifyId;

  spotifyApi.setAccessToken(req.user.spotifyAccesToken);
  spotifyApi.setRefreshToken(req.user.spotifyRefreshToken);

  try {
    spotifyApi.getUserPlaylists(userId)
      .then(
        data => res.status(200).send(data.body),
        err => res.status(400).send(err),
      );
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
