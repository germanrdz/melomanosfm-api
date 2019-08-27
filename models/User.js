/* eslint-disable func-names */
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
  },
  spotifyId: {
    type: String,
    required: true,
    unique: true,
  },
  spotifyUrl: {
    type: String,
  },
  spotifyAccesToken: {
    type: String,
  },
  spotifyRefreshToken: {
    type: String,
  },
});

userSchema.statics.findOrCreate = async function findOrCreate(newUser) {
  let user = await this.findOne({ email: newUser.email });

  if (!user) {
    user = new this(newUser);
    await user.save();
  }

  return user;
};

module.exports = mongoose.model('User', userSchema);
