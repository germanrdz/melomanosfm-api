const express = require('express');
const spotifyApi = require('../services/spotify-api');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/spotify/my-playlists', auth, async (req, res) => {
  const userId = req.user.spotifyId;

  spotifyApi.setAccessToken(req.user.spotifyAccesToken);
  spotifyApi.setRefreshToken(req.user.spotifyRefreshToken);

  console.log('user from db after auth middleware', req.user);

  spotifyApi.getUserPlaylists(userId)
    .then(
      data => res.status(200).send(data.body),
      err => res.status(400).send(err),
    ).catch(err => res.status(500).send({ error: err }));
});

module.exports = router;
