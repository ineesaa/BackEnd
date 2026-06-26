
function requireAuth(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ error: 'You must be logged in.' });
  }
  req.user = {
    id: req.session.userId,
    role: req.session.role,
  };
  next();
}

module.exports = requireAuth;
