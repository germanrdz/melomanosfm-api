/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
const express = require('express');
const jwt = require('jsonwebtoken');

const spotifyApi = require('../services/spotify-api');
const User = require('../models/User');

// Constants
const router = express.Router();
const SPOTIFY_STATE_KEY = 'spotify_auth_state';
const SCOPES = [
  'user-read-private',
  'user-read-email',
  'user-top-read',
];

// Helpers
const generateRandomString = N => (Math.random().toString(36) + Array(N).join('0')).slice(2, N + 2);

// Routes
router.get('/auth/spotify/login', (req, res) => {
  const state = generateRandomString(16);
  res.cookie(SPOTIFY_STATE_KEY, state);
  res.redirect(spotifyApi.createAuthorizeURL(SCOPES, state));
});

// callback will redirect..
// to => /auth/success/{token}/{refresh_token}
//       if everything is ok
// to => /auth/error/{error_code}
//      if something fails
router.get('/auth/spotify/callback', (req, res) => {
  const { code, state } = req.query;
  const storedState = req.cookies ? req.cookies[SPOTIFY_STATE_KEY] : null;

  // if the state is valid,
  if (state === null || state !== storedState) {
    res.redirect(`${process.env.REACT_APP_URL}/auth/error/state_mismatch`);
  } else {
    res.clearCookie(SPOTIFY_STATE_KEY);

    // get the authorization code
    spotifyApi.authorizationCodeGrant(code)
      .then(async (data) => {
        const { access_token, refresh_token } = data.body;

        // use the access token to access the Spotify Web API
        spotifyApi.setAccessToken(access_token);
        spotifyApi.setRefreshToken(refresh_token);

        // fetch user profile from spotify API
        const { body } = await spotifyApi.getMe();
        let user = {
          name: body.display_name,
          email: body.email,
          image: body.images[0].url,
          spotifyId: body.id,
          spotifyUrl: body.external_urls.spotify,
          spotifyAccesToken: access_token,
          spotifyRefreshToken: refresh_token,
        };

        // save (or update) in database
        try {
          user = await User.findOrCreate(user);

          if (user) {
            user.spotifyAccesToken = access_token;
            user.spotifyRefreshToken = refresh_token;
            await user.save();
          }
        } catch (err) {
          return res.redirect(`${process.env.REACT_APP_URL}/auth/error/user_create`);
        }

        const { spotifyAccesToken, spotifyRefreshToken, ...rest } = user.toObject();
        const token = jwt.sign(rest, process.env.JWT_KEY);

        // pass tokens to the client via redirection (query string)
        // return res.redirect(`${process.env.REACT_APP_URL}/auth/success/${access_token}/${refresh_token}`);
        return res.redirect(`${process.env.REACT_APP_URL}/auth/success/${token}`);
      }).catch(() => {
        // console.log(error);
        res.redirect(`${process.env.REACT_APP_URL}/auth/error/invalid_token`);
      });
  }
});

module.exports = router;
