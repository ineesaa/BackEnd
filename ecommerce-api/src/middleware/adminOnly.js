const requireAuth = require('./auth');

/**
 * adminOnly — must be used AFTER requireAuth (or it chains them itself).
 * Rejects non-admin users with 403 before the route handler runs.
 */
function adminOnly(req, res, next) {
  // If requireAuth hasn't run yet (used standalone), run it first
  if (!req.user) {
    return requireAuth(req, res, () => checkRole(req, res, next));
  }
  checkRole(req, res, next);
}

function checkRole(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required.' });
  }
  next();
}

module.exports = adminOnly;
