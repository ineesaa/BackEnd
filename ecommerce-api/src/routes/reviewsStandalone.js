const express = require('express');
const prisma = require('../db');
const requireAuth = require('../middleware/auth');

const router = express.Router();

// DELETE /reviews/:id — owner or admin
router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const reviewId = parseInt(req.params.id);

    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) {
      return res.status(404).json({ error: 'Review not found.' });
    }

    // Only the review owner or an admin can delete
    if (req.user.role !== 'admin' && review.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    await prisma.review.delete({ where: { id: reviewId } });
    res.json({ message: 'Review deleted.' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
