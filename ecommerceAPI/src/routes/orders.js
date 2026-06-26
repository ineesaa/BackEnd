const express = require('express');
const prisma = require('../db');
const requireAuth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');

const router = express.Router();
const VALID_STATUSES = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];

// POST /orders/checkout
// Converts the current cart to an order. Fully transactional:
//   1. Read cart items with current product prices
//   2. Verify stock is sufficient for every item
//   3. Create the order + order_items (locking in prices)
//   4. Decrement product stock
//   5. Delete all cart items (clear the cart)
//   6. If any step fails → entire transaction rolls back
router.post('/checkout', requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;

    const order = await prisma.$transaction(async (tx) => {
      // Load the cart with items + current product data
      const cart = await tx.cart.findUnique({
        where: { userId },
        include: {
          items: {
            include: { product: true },
          },
        },
      });

      if (!cart || cart.items.length === 0) {
        throw Object.assign(new Error('Your cart is empty.'), { statusCode: 400 });
      }
      for (const item of cart.items) {
        if (item.product.stock < item.quantity) {
          throw Object.assign(
            new Error(
              `Not enough stock for "${item.product.name}". Available: ${item.product.stock}, requested: ${item.quantity}.`
            ),
            { statusCode: 400 }
          );
        }
      }

      const total = cart.items.reduce(
        (sum, item) => sum + parseFloat(item.product.price) * item.quantity,
        0
      );
      const newOrder = await tx.order.create({
        data: {
          userId,
          total,
          status: 'pending',
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              priceAtPurchase: item.product.price, // snapshot of price at purchase time
            })),
          },
        },
        include: { items: true },
      });
      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return newOrder;
    });

    res.status(201).json(order);
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    next(err);
  }
});
// GET /orders
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const where = req.user.role === 'admin' ? {} : { userId: req.user.id };

    const orders = await prisma.order.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: {
          include: { product: { select: { id: true, name: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(orders);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', requireAuth, async (req, res, next) => {
  try {
    const orderId = parseInt(req.params.id);

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: {
          include: { product: { select: { id: true, name: true } } },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }
    if (req.user.role !== 'admin' && order.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    res.json(order);
  } catch (err) {
    next(err);
  }
});
// PATCH /orders/:id/status — admin only
router.patch('/:id/status', requireAuth, adminOnly, async (req, res, next) => {
  try {
    const orderId = parseInt(req.params.id);
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'status is required.' });
    }
    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}.`,
      });
    }

    const existing = await prisma.order.findUnique({ where: { id: orderId } });
    if (!existing) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
