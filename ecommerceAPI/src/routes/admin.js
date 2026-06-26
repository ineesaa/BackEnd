const express = require('express');
const prisma = require('../db');
const requireAuth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');
const router = express.Router();

// GET /admin/reports/best-sellers
router.get('/reports/best-sellers', requireAuth, adminOnly, async (req, res, next) => {
  try {
    const results = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 10,
    });
    const productIds = results.map((r) => r.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true, price: true },
    });

    const productMap = Object.fromEntries(products.map((p) => [p.id, p]));

    const report = results.map((r) => ({
      product: productMap[r.productId],
      totalQuantitySold: r._sum.quantity,
    }));

    res.json(report);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
