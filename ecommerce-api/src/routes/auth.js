const express = require('express');
const bcrypt = require('bcrypt');
const prisma = require('../db');
const requireAuth = require('../middleware/auth');

const router = express.Router();
const SALT_ROUNDS = 10;

// POST /auth/register
// Creates a new user and automatically provisions an empty cart.
router.post('/register', async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'email, password and name are required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'Email is already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Create the user AND an empty cart in one transaction
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: { email, password: hashedPassword, name },
      });
      await tx.cart.create({ data: { userId: newUser.id } });
      return newUser;
    });

    // Start a session
    req.session.userId = user.id;
    req.session.role = user.role;

    res.status(201).json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  } catch (err) {
    next(err);
  }
});

// POST /auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required.' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    req.session.userId = user.id;
    req.session.role = user.role;

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  } catch (err) {
    next(err);
  }
});

// GET /auth/me — returns the currently logged-in user
router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json(user);
  } catch (err) {
    next(err);
  }
});

// POST /auth/logout
router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ message: 'Logged out.' });
  });
});

module.exports = router;
