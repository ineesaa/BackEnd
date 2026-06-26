/**
 * Seed script — populates the database with:
 *   - 1 admin user
 *   - 1 customer user
 *   - 4 categories
 *   - 6 products linked to categories
 *
 * Run with: node prisma/seed.js
 */

require('dotenv').config();
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

async function main() {
  console.log('Seeding database…');

  // ── Users ──────────────────────────────────────────────────────────────
  const adminPassword = await bcrypt.hash('admin123', SALT_ROUNDS);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'admin',
    },
  });

  const customerPassword = await bcrypt.hash('customer123', SALT_ROUNDS);
  const customer = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      password: customerPassword,
      name: 'Test Customer',
      role: 'customer',
      cart: { create: {} }, // provision cart on creation
    },
  });

  // Ensure admin has a cart too
  await prisma.cart.upsert({
    where: { userId: admin.id },
    update: {},
    create: { userId: admin.id },
  });

  console.log(`  Admin   → ${admin.email}  (password: admin123)`);
  console.log(`  Customer → ${customer.email}  (password: customer123)`);

  // ── Categories ─────────────────────────────────────────────────────────
  const categoryNames = [
    { name: 'Electronics',   description: 'Gadgets and electronic devices' },
    { name: 'Books',         description: 'Physical and digital books' },
    { name: 'Clothing',      description: 'Apparel and accessories' },
    { name: 'Home & Garden', description: 'Products for home and outdoor spaces' },
  ];

  const categories = [];
  for (const cat of categoryNames) {
    const c = await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: cat,
    });
    categories.push(c);
    console.log(`  Category → ${c.name}`);
  }

  const [electronics, books, clothing, homeGarden] = categories;

  // ── Products ───────────────────────────────────────────────────────────
  const products = [
    {
      name: 'Wireless Headphones',
      description: 'Over-ear noise-cancelling headphones with 30-hour battery.',
      price: 149.99,
      stock: 50,
      categoryIds: [electronics.id],
    },
    {
      name: 'USB-C Hub',
      description: '7-in-1 USB-C hub with HDMI, USB 3.0, and PD charging.',
      price: 39.99,
      stock: 120,
      categoryIds: [electronics.id],
    },
    {
      name: 'Clean Code',
      description: 'A handbook of agile software craftsmanship by Robert C. Martin.',
      price: 34.99,
      stock: 200,
      categoryIds: [books.id],
    },
    {
      name: 'The Pragmatic Programmer',
      description: 'Your journey to mastery — essential reading for every developer.',
      price: 49.99,
      stock: 80,
      categoryIds: [books.id],
    },
    {
      name: 'Developer Hoodie',
      description: 'Soft cotton hoodie. "Works on my machine" print on the back.',
      price: 59.99,
      stock: 75,
      categoryIds: [clothing.id],
    },
    {
      name: 'Mechanical Keyboard',
      description: 'TKL layout with Cherry MX Blue switches. Great for home office.',
      price: 129.99,
      stock: 30,
      categoryIds: [electronics.id, homeGarden.id],
    },
  ];

  for (const p of products) {
    const { categoryIds, ...data } = p;
    const product = await prisma.product.create({
      data: {
        ...data,
        categories: {
          create: categoryIds.map((cid) => ({
            category: { connect: { id: cid } },
          })),
        },
      },
    });
    console.log(`  Product  → ${product.name} ($${product.price})`);
  }

  console.log('\nSeeding complete!');
}

main()
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
