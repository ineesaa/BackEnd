const express = require('express');
const prisma = require('../db');
const requireAuth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');

const router = express.Router();
router.get('/', async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
    res.json(categories);
  } catch (err) {
    next(err);
  }
});

router.post('/', requireAuth, adminOnly, async (req, res, next) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'name is required.' });
    }

    const existing = await prisma.category.findUnique({ where: { name } });
    if (existing) {
      return res.status(409).json({ error: 'A category with that name already exists.' });
    }

    const category = await prisma.category.create({
      data: { name, description },
    });

    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', requireAuth, adminOnly, async (req, res, next) => {
  try {
    const categoryId = parseInt(req.params.id);

    const existing = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!existing) {
      return res.status(404).json({ error: 'Category not found.' });
    }

    await prisma.category.delete({ where: { id: categoryId } });
    res.json({ message: 'Category deleted.' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
