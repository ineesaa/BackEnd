# E-Commerce API

A RESTful backend for a small online store, built with **Node.js**, **Express**, **PostgreSQL**, and **Prisma** (ORM).

---

## Why Prisma?

Prisma was chosen because:
- A single `schema.prisma` file is the sole source of truth for the entire database structure.
- Migrations are auto-generated SQL files — no hand-writing `ALTER TABLE` statements.
- Prisma Studio gives a visual database browser during development.
- Generated TypeScript types (even in a JS project) catch mistakes early.

---

## Tech Stack

| Layer | Tool |
|---|---|
| Runtime | Node.js |
| Framework | Express |
| Database | PostgreSQL |
| ORM / Migrations | Prisma |
| Auth | express-session + bcrypt |
| Environment | dotenv |

---

## Setup Instructions

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Create a `.env` file in the project root (never commit this file):

```env
DATABASE_URL="postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/ecommerce?schema=public"
SESSION_SECRET="a-long-random-string-change-this"
PORT=3000
```

Replace `YOUR_USER` and `YOUR_PASSWORD` with your PostgreSQL credentials.

### 3. Create the database

```bash
psql -U postgres -c "CREATE DATABASE ecommerce;"
```

### 4. Run migrations

Apply all migrations to build the schema:

```bash
npm run migrate
```

For development (creates new migration files when you change `schema.prisma`):

```bash
npm run migrate:dev -- --name your_migration_name
```

### 5. (Optional) Seed sample data

Inserts an admin user, a customer, 4 categories, and 6 products:

```bash
node prisma/seed.js
```

Seed credentials:
- Admin: `admin@example.com` / `admin123`
- Customer: `customer@example.com` / `customer123`

### 6. Start the server

```bash
# Production
npm start

# Development (auto-restarts on file changes)
npm run dev
```

The API will be available at `http://localhost:3000`.

### 7. (Optional) Prisma Studio

Open the visual database browser:

```bash
npm run studio
```

---

## Project Structure

```
ecommerce-api/
├── prisma/
│   ├── schema.prisma           ← all models (single source of truth)
│   ├── migrations/             ← migration history (commit to git)
│   │   └── 20260622_000000_init/
│   │       └── migration.sql
│   └── seed.js                 ← optional sample data
├── src/
│   ├── server.js               ← Express app entry point
│   ├── db.js                   ← shared Prisma client
│   ├── middleware/
│   │   ├── auth.js             ← requireAuth — checks active session
│   │   └── adminOnly.js        ← adminOnly — rejects non-admins with 403
│   └── routes/
│       ├── auth.js             ← /auth/*
│       ├── products.js         ← /products/*
│       ├── categories.js       ← /categories/*
│       ├── cart.js             ← /cart/*
│       ├── orders.js           ← /orders/*
│       ├── reviews.js          ← GET + POST /products/:id/reviews
│       ├── reviewsStandalone.js← DELETE /reviews/:id
│       └── admin.js            ← /admin/reports/*
├── .env                        ← NOT committed (see .gitignore)
├── .gitignore
├── package.json
└── README.md
```

---

## API Endpoints

### Authentication

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | — | Register a new account (email, password, name) |
| POST | `/auth/login` | — | Log in and start a session |
| GET | `/auth/me` | ✓ | Return the current user's info |
| POST | `/auth/logout` | ✓ | Destroy the session |

### Products

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/products` | — | List all products. Supports `?category=`, `?search=`, `?minPrice=`, `?maxPrice=`, `?inStock=true`, `?page=`, `?pageSize=` |
| GET | `/products/:id` | — | One product with its categories, reviews, and average rating |
| POST | `/products` | admin | Create a product (optionally attach `categoryIds`) |
| PUT | `/products/:id` | admin | Update a product (partial update supported) |
| DELETE | `/products/:id` | admin | Delete a product |

### Categories

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/categories` | — | List all categories |
| POST | `/categories` | admin | Create a category |
| DELETE | `/categories/:id` | admin | Delete a category |

### Cart

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/cart` | ✓ | Get current user's cart with items and product details |
| POST | `/cart/items` | ✓ | Add a product `{ productId, quantity }` — increases quantity if already in cart |
| PUT | `/cart/items/:id` | ✓ | Update quantity of a cart item |
| DELETE | `/cart/items/:id` | ✓ | Remove a cart item |

### Orders

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/orders/checkout` | ✓ | Convert cart to order — verifies stock, snapshots prices, clears cart (fully transactional) |
| GET | `/orders` | ✓ | Customer: own orders. Admin: all orders |
| GET | `/orders/:id` | ✓ | One order with its items (customers can only see their own) |
| PATCH | `/orders/:id/status` | admin | Update order status (`pending` → `paid` → `shipped` → `delivered` / `cancelled`) |

### Reviews

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/products/:id/reviews` | — | All reviews for a product |
| POST | `/products/:id/reviews` | ✓ | Add a review `{ rating, comment? }` — only if user has a delivered order with this product |
| DELETE | `/reviews/:id` | ✓ | Delete a review (owner or admin only) |

### Admin Reports (Bonus)

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/admin/reports/best-sellers` | admin | Top 10 products by total quantity sold |

---

## Example Requests

### Register

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"secret123","name":"Alice"}'
```

### Add to cart

```bash
curl -X POST http://localhost:3000/cart/items \
  -H "Content-Type: application/json" \
  --cookie "connect.sid=YOUR_SESSION_COOKIE" \
  -d '{"productId":1,"quantity":2}'
```

### Checkout

```bash
curl -X POST http://localhost:3000/orders/checkout \
  --cookie "connect.sid=YOUR_SESSION_COOKIE"
```

---

## Security Notes

- Passwords are hashed with **bcrypt** (cost factor 10) — never stored or returned in plain text.
- Sessions use signed HTTP-only cookies.
- All database queries use Prisma's parameterized methods — no string concatenation, no SQL injection risk.
- Admin-only routes reject non-admin users with **403** *before* the action runs.
- Customers can only access their own cart and orders — server always reads `userId` from the session, never from the request body.
- `.env` is excluded from git via `.gitignore`.

---

## Database Design

All 9 tables with their relationships:

```
users ──────────────┬── cart (1-to-1, UNIQUE on user_id)
                    ├── orders (1-to-many)
                    └── reviews (1-to-many)

products ───────────┬── product_categories (many-to-many with categories)
                    ├── cart_items
                    ├── order_items
                    └── reviews

orders ─────────────── order_items (1-to-many)
carts ──────────────── cart_items (1-to-many)
```

Key constraints enforced at the DB level:
- `users.email` UNIQUE
- `carts.user_id` UNIQUE (enforces one cart per user)
- `cart_items(cart_id, product_id)` UNIQUE (one row per product per cart)
- `reviews(user_id, product_id)` UNIQUE (one review per user per product)
- `product_categories(product_id, category_id)` composite PRIMARY KEY
- `products.price` CHECK > 0
- `products.stock` CHECK >= 0
- `orders.status` CHECK IN ('pending','paid','shipped','delivered','cancelled')
- `reviews.rating` CHECK BETWEEN 1 AND 5

---

## Bonus Features Implemented

- **Product search** — `?search=` on `GET /products` (case-insensitive, name + description)
- **Pagination** — `?page=` and `?pageSize=` on `GET /products`, returns `{ items, total, page, pageSize }`
- **Average rating** — included in every product response
- **Best-seller report** — `GET /admin/reports/best-sellers`
- **Seed data** — `node prisma/seed.js`
