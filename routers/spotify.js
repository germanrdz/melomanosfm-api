const express = require('express');
const spotifyApi = require('../services/spotify-api');
const auth = require('../middleware/auth');

const router = express.Router();

const setApiTokens = (req, res, next) => {
  spotifyApi.setAccessToken(req.user.spotifyAccesToken);
  spotifyApi.setRefreshToken(req.user.spotifyRefreshToken);

  next();
};

router.get('/spotify/my-playlists', auth, setApiTokens, async (req, res) => {
  const userId = req.user.spotifyId;

  spotifyApi.getUserPlaylists(userId)
    .then(
      data => res.status(200).send(data.body),
      err => res.status(400).send(err),
    ).catch(err => res.status(500).send({ error: err }));
});

router.get('/spotify/my-artists', auth, setApiTokens, async (req, res) => {
  spotifyApi.getMyTopArtists()
    .then(
      data => res.status(200).send(data.body),
      err => res.status(400).send(err),
    ).catch(err => res.status(500).send({ error: err }));
});

module.exports = router;
