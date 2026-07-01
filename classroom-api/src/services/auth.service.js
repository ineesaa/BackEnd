const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');

function signToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

async function register({ name, email, password, role }) {
  const existing = await User.findOne({ email });
  if (existing) {
    throw new AppError('Email already in use', 409);
  }

  const user = new User({ name, email, password, role });
  await user.save();

  const token = signToken(user);
  return { user, token };
}

async function login({ email, password }) {
  const user = await User.findOne({ email });

  if (!user) throw new AppError('Invalid credentials', 401);

  const valid = await user.comparePassword(password);

  if (!valid) throw new AppError('Invalid credentials', 401);

  const token = signToken(user);
  return { user, token };
}

module.exports = { register, login };
