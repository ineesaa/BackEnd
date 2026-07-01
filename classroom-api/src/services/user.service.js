const User = require('../models/User');
const AppError = require('../utils/AppError');

async function listAll() {
  return User.find().sort({ createdAt: -1 });
}

async function getById(id) {
  const user = await User.findById(id);
  if (!user) throw new AppError('User not found', 404);

  return user;
}

module.exports = { listAll, getById };
