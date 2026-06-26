const express = require('express');
const prisma = require('../db');
const requireAuth = require('../middleware/auth');
const router = express.Router();

async function getOrCreateCart(userId) {
  let cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) {
    cart = await prisma.cart.create({ data: { userId } });
  }
  return cart;
}
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: {
        items: {
          include: {
            product: {
              select: { id: true, name: true, price: true, stock: true },
            },
          },
        },
      },
    });

    if (!cart) {
      const newCart = await prisma.cart.create({
        data: { userId: req.user.id },
        include: { items: true },
      });
      return res.json(newCart);
    }

    res.json(cart);
  } catch (err) {
    next(err);
  }
});

router.post('/items', requireAuth, async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({ error: 'productId and quantity are required.' });
    }
    if (parseInt(quantity) < 1) {
      return res.status(400).json({ error: 'quantity must be at least 1.' });
    }

    const product = await prisma.product.findUnique({ where: { id: parseInt(productId) } });
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    const cart = await getOrCreateCart(req.user.id);
    const existingItem = await prisma.cartItem.findUnique({
      where: { cartId_productId: { cartId: cart.id, productId: parseInt(productId) } },
    });

    let item;
    if (existingItem) {
      item = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + parseInt(quantity) },
        include: { product: { select: { id: true, name: true, price: true } } },
      });
    } else {
      item = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: parseInt(productId),
          quantity: parseInt(quantity),
        },
        include: { product: { select: { id: true, name: true, price: true } } },
      });
    }

    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
});


router.put('/items/:id', requireAuth, async (req, res, next) => {
  try {
    const itemId = parseInt(req.params.id);
    const { quantity } = req.body;

    if (quantity === undefined) {
      return res.status(400).json({ error: 'quantity is required.' });
    }
    if (parseInt(quantity) < 1) {
      return res.status(400).json({ error: 'quantity must be at least 1.' });
    }

    const cart = await prisma.cart.findUnique({ where: { userId: req.user.id } });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found.' });
    }

    const item = await prisma.cartItem.findUnique({ where: { id: itemId } });
    if (!item || item.cartId !== cart.id) {
      return res.status(404).json({ error: 'Cart item not found.' });
    }

    const updated = await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity: parseInt(quantity) },
      include: { product: { select: { id: true, name: true, price: true } } },
    });

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

router.delete('/items/:id', requireAuth, async (req, res, next) => {
  try {
    const itemId = parseInt(req.params.id);
    const cart = await prisma.cart.findUnique({ where: { userId: req.user.id } });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found.' });
    }

    const item = await prisma.cartItem.findUnique({ where: { id: itemId } });
    if (!item || item.cartId !== cart.id) {
      return res.status(404).json({ error: 'Cart item not found.' });
    }

    await prisma.cartItem.delete({ where: { id: itemId } });
    res.json({ message: 'Item removed from cart.' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
