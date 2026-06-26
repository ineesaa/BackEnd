/**
 * requireAuth — rejects requests with no active session.
 * Attaches req.user for downstream route handlers.
 */
function requireAuth(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ error: 'You must be logged in.' });
  }
  // Expose userId and role conveniently on req.user
  req.user = {
    id: req.session.userId,
    role: req.session.role,
  };
  next();
}

module.exports = requireAuth;
