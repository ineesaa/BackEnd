const express = require('express');
const prisma = require('../db');
const requireAuth = require('../middleware/auth');

const router = express.Router();

// GET /products/:id/reviews — public
router.get('/:productId/reviews', async (req, res, next) => {
  try {
    const productId = parseInt(req.params.productId);

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    const reviews = await prisma.review.findMany({
      where: { productId },
      include: { user: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });

    res.json(reviews);
  } catch (err) {
    next(err);
  }
});

// POST /products/:id/reviews — logged-in customers who purchased the product
// Body: { rating (1-5), comment? }
router.post('/:productId/reviews', requireAuth, async (req, res, next) => {
  try {
    const productId = parseInt(req.params.productId);
    const userId = req.user.id;
    const { rating, comment } = req.body;

    if (rating === undefined) {
      return res.status(400).json({ error: 'rating is required.' });
    }
    if (!Number.isInteger(parseInt(rating)) || parseInt(rating) < 1 || parseInt(rating) > 5) {
      return res.status(400).json({ error: 'rating must be an integer between 1 and 5.' });
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    // Verify the user has a delivered order containing this product
    const purchaseVerified = await prisma.orderItem.findFirst({
      where: {
        productId,
        order: {
          userId,
          status: 'delivered',
        },
      },
    });

    if (!purchaseVerified) {
      return res.status(403).json({
        error: 'You can only review products you have purchased and received.',
      });
    }

    // Create review — the UNIQUE constraint on (userId, productId) enforces one-per-user
    const review = await prisma.review.create({
      data: {
        userId,
        productId,
        rating: parseInt(rating),
        comment,
      },
      include: { user: { select: { id: true, name: true } } },
    });

    res.status(201).json(review);
  } catch (err) {
    // Prisma unique constraint violation code
    if (err.code === 'P2002') {
      return res.status(409).json({ error: 'You have already reviewed this product.' });
    }
    next(err);
  }
});

module.exports = router;
