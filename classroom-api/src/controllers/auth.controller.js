const authService = require('../services/auth.service');

async function register(req, res) {
  const { name, email, password, role } = req.body;
  // Validated

  const { user, token } = await authService.register({ name, email, password, role });
  res.status(201).json({ user, token });
}

async function login(req, res) {
  const { email, password } = req.body;
  const { user, token } = await authService.login({ email, password });
  res.json({
    message: 'Logged in',
    userId: user._id,
    role: user.role,
    token,
  });
}

module.exports = { register, login };
