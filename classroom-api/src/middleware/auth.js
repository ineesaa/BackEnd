const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

function auth(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return next(new AppError('Not authenticated', 401));
  }

  const token = header.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // payload is whatever we signed in auth.service (id, role)
    req.user = payload;
    next();
  } catch (err) {
    next(new AppError('Invalid or expired token', 401));
  }
}

// usage: restrictTo('teacher') -- must come after auth()
function restrictTo(...roles) {
  return function (req, res, next) {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to do this', 403));
    }
    next();
  };
}

module.exports = auth;
module.exports.restrictTo = restrictTo;
