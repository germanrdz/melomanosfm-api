/* eslint-disable func-names */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
});

/*
userSchema.statics.findByCredentials = async (email, password) => {
  // Search for a user by email and password.
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error({ error: 'Invalid login credentials' });
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new Error({ error: 'Invalid login credentials' });
  }
  return user;
};
*/

userSchema.statics.findOrCreate = async function findOrCreate(newUser) {
  let user = await this.findOne({ email: newUser.email });

  if (!user) {
    user = new this(newUser);
    await user.save();
  }

  return user;
};

module.exports = mongoose.model('User', userSchema);
