/* eslint-disable no-underscore-dangle */
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const spotifyApi = require('../services/spotify-api');

const auth = async (req, res, next) => {
  try {
    const token = req.header('access-token');
    const data = jwt.verify(token, process.env.JWT_KEY);

    let user = await User.findOne({ _id: data._id });

    if (!user) {
      throw new Error();
    }

    // refresh token
    await spotifyApi.refreshAccessToken().then(
      async (response) => {
        // eslint-disable-next-line dot-notation
        const newToken = response.body['access_token'];

        user.spotifyAccesToken = newToken;
        user = await user.save();
      },
      (err) => { console.log('Error refreshing access token', err); },
    );

    req.user = user;
    req.token = token;

    next();
  } catch (error) {
    res.status(401).send({ error: 'Not authorized to access this resource' });
  }
};

module.exports = auth;
