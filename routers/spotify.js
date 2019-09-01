const express = require('express');
const spotifyApi = require('../services/spotify-api');
const auth = require('../middleware/auth');

const router = express.Router();

// Middleware
const setApiTokens = async (req, res, next) => {
  await spotifyApi.setAccessToken(req.user.spotifyAccesToken);
  await spotifyApi.setRefreshToken(req.user.spotifyRefreshToken);

  next();
};

// Routes
router.get('/spotify/my-playlists', auth, setApiTokens, async (req, res) => {
  const userId = req.user.spotifyId;
  const options = { limit: 50, offset: 0 };

  spotifyApi.getUserPlaylists(userId, options)
    .then(
      data => res.status(200).send(data.body),
      err => res.status(400).send(err),
    ).catch(err => res.status(500).send({ error: err }));
});

router.get('/spotify/my-top-artists', auth, setApiTokens, async (req, res) => {
  spotifyApi.getMyTopArtists({ time_range: 'medium_term' })
    .then(
      data => res.status(200).send(data.body),
      err => res.status(400).send(err),
    ).catch(err => res.status(500).send({ error: err }));
});

module.exports = router;
