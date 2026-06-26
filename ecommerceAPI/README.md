# E-Commerce API

Backend REST API for an online store built with Node.js, Express, PostgreSQL, and Prisma.

I chose Prisma because it keeps all models in one schema file and generates migrations automatically.

## Setup

**1. Install dependencies**
```bash
npm install
```

**2. Create the database**
```bash
psql -c "CREATE DATABASE ecommerce;"
```

**3. Create .env file**
```
DATABASE_URL="postgresql://YOUR_USERNAME@localhost:5432/ecommerce?schema=public"
SESSION_SECRET="your-secret-here"
PORT=3000
```

**4. Run migrations**
```bash
npx prisma migrate deploy
```

**5. Seed sample data (optional)**
```bash
node prisma/seed.js
```
Seed users:
- Admin: `admin@example.com` / `admin123`
- Customer: `customer@example.com` / `customer123`

**6. Start the server**
```bash
npm run dev
```

## Endpoints

### Auth
| Method | Path | Description |
|---|---|---|
| POST | /auth/register | Register a new account |
| POST | /auth/login | Login |
| GET | /auth/me | Get current user |
| POST | /auth/logout | Logout |

### Products
| Method | Path | Description |
|---|---|---|
| GET | /products | List products (supports ?category, ?search, ?minPrice, ?maxPrice, ?inStock, ?page, ?pageSize) |
| GET | /products/:id | Get one product with categories and reviews |
| POST | /products | Create product (admin) |
| PUT | /products/:id | Update product (admin) |
| DELETE | /products/:id | Delete product (admin) |

### Categories
| Method | Path | Description |
|---|---|---|
| GET | /categories | List all categories |
| POST | /categories | Create category (admin) |
| DELETE | /categories/:id | Delete category (admin) |

### Cart
| Method | Path | Description |
|---|---|---|
| GET | /cart | Get current user's cart |
| POST | /cart/items | Add item to cart |
| PUT | /cart/items/:id | Update item quantity |
| DELETE | /cart/items/:id | Remove item |

### Orders
| Method | Path | Description |
|---|---|---|
| POST | /orders/checkout | Checkout cart (creates order, clears cart) |
| GET | /orders | List orders (customers see own, admin sees all) |
| GET | /orders/:id | Get one order |
| PATCH | /orders/:id/status | Update order status (admin) |

### Reviews
| Method | Path | Description |
|---|---|---|
| GET | /products/:id/reviews | Get reviews for a product |
| POST | /products/:id/reviews | Add a review (must have purchased the product) |
| DELETE | /reviews/:id | Delete a review (owner or admin) |

### Admin
| Method | Path | Description |
|---|---|---|
| GET | /admin/reports/best-sellers | Top 10 products by quantity sold |
