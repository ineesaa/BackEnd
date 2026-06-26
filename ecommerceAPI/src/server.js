require('dotenv').config();
const express = require('express');
const session = require('express-session');

const authRoutes          = require('./routes/auth');
const productRoutes       = require('./routes/products');
const categoryRoutes      = require('./routes/categories');
const cartRoutes          = require('./routes/cart');
const orderRoutes         = require('./routes/orders');
const productReviewRoutes = require('./routes/reviews');          // GET + POST /products/:id/reviews
const reviewRoutes        = require('./routes/reviewsStandalone'); // DELETE /reviews/:id
const adminRoutes         = require('./routes/admin');

const app = express();

// ── Middleware
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'change-this-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  })
);

// ── Routes 
app.use('/auth',               authRoutes);
app.use('/products',           productRoutes);
app.use('/products',           productReviewRoutes); 
app.use('/categories',         categoryRoutes);
app.use('/cart',               cartRoutes);
app.use('/orders',             orderRoutes);
app.use('/reviews',            reviewRoutes);
app.use('/admin',              adminRoutes);

// ── 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

// ── Global error handler
app.use((err, req, res, next) => { 
  console.error(err);

  // Prisma-specific error codes
  if (err.code === 'P2025') {
    return res.status(404).json({ error: 'Record not found.' });
  }
  if (err.code === 'P2002') {
    return res.status(409).json({ error: 'Duplicate value — a record with this data already exists.' });
  }
  if (err.code === 'P2003') {
    return res.status(400).json({ error: 'Foreign key constraint failed — referenced record does not exist.' });
  }

  const status = err.statusCode || err.status || 500;
  res.status(status).json({ error: err.message || 'Internal server error.' });
});

// ── Start 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`E-Commerce API running on http://localhost:${PORT}`);
});
