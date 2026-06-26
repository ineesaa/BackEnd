const express = require('express');
const prisma = require('../db');
const requireAuth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');
const router = express.Router();

// GET /products
router.get('/', async (req, res, next) => {
  try {
    const {
      category,
      search,
      minPrice,
      maxPrice,
      inStock,
      page = 1,
      pageSize = 20,
    } = req.query;

    const where = {};
    if (category) {
      where.categories = {
        some: { category: { name: { equals: category, mode: 'insensitive' } } },
      };
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = parseFloat(minPrice);
      if (maxPrice !== undefined) where.price.lte = parseFloat(maxPrice);
    }

    if (inStock === 'true') {
      where.stock = { gt: 0 };
    }

    const pageNum = Math.max(1, parseInt(page));
    const size = Math.min(100, Math.max(1, parseInt(pageSize)));
    const skip = (pageNum - 1) * size;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: size,
        include: {
          categories: { include: { category: { select: { id: true, name: true } } } },
          reviews: { select: { rating: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ]);

    const formatted = products.map((p) => ({
      ...p,
      categories: p.categories.map((pc) => pc.category),
      averageRating: p.reviews.length
        ? parseFloat(
            (p.reviews.reduce((sum, r) => sum + r.rating, 0) / p.reviews.length).toFixed(2)
          )
        : null,
      reviewCount: p.reviews.length,
      reviews: undefined,
    }));

    res.json({ items: formatted, total, page: pageNum, pageSize: size });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        categories: { include: { category: { select: { id: true, name: true } } } },
        reviews: {
          include: { user: { select: { id: true, name: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    const averageRating = product.reviews.length
      ? parseFloat(
          (
            product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
          ).toFixed(2)
        )
      : null;

    res.json({
      ...product,
      categories: product.categories.map((pc) => pc.category),
      averageRating,
      reviewCount: product.reviews.length,
    });
  } catch (err) {
    next(err);
  }
});
// POST /products — admin only
router.post('/', requireAuth, adminOnly, async (req, res, next) => {
  try {
    const { name, description, price, stock, categoryIds } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ error: 'name and price are required.' });
    }
    if (parseFloat(price) <= 0) {
      return res.status(400).json({ error: 'price must be greater than 0.' });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        stock: stock !== undefined ? parseInt(stock) : 0,
        categories: categoryIds?.length
          ? {
              create: categoryIds.map((cid) => ({
                category: { connect: { id: cid } },
              })),
            }
          : undefined,
      },
      include: {
        categories: { include: { category: { select: { id: true, name: true } } } },
      },
    });

    res.status(201).json({
      ...product,
      categories: product.categories.map((pc) => pc.category),
    });
  } catch (err) {
    next(err);
  }
});

// PUT /products/:id — admin only
router.put('/:id', requireAuth, adminOnly, async (req, res, next) => {
  try {
    const productId = parseInt(req.params.id);
    const { name, description, price, stock, categoryIds } = req.body;

    const existing = await prisma.product.findUnique({ where: { id: productId } });
    if (!existing) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    if (price !== undefined && parseFloat(price) <= 0) {
      return res.status(400).json({ error: 'price must be greater than 0.' });
    }
    const categoryUpdate =
      categoryIds !== undefined
        ? {
            deleteMany: {},
            create: categoryIds.map((cid) => ({
              category: { connect: { id: cid } },
            })),
          }
        : undefined;

    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(stock !== undefined && { stock: parseInt(stock) }),
        ...(categoryUpdate && { categories: categoryUpdate }),
      },
      include: {
        categories: { include: { category: { select: { id: true, name: true } } } },
      },
    });

    res.json({
      ...product,
      categories: product.categories.map((pc) => pc.category),
    });
  } catch (err) {
    next(err);
  }
});
// DELETE /products/:id — admin only
router.delete('/:id', requireAuth, adminOnly, async (req, res, next) => {
  try {
    const productId = parseInt(req.params.id);

    const existing = await prisma.product.findUnique({ where: { id: productId } });
    if (!existing) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    await prisma.product.delete({ where: { id: productId } });
    res.json({ message: 'Product deleted.' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
