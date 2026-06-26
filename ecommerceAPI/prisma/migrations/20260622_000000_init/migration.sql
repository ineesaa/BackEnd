-- Migration: 20260622_000000_init
-- Creates all 9 tables for the e-commerce API

CREATE TABLE "users" (
  "id"         SERIAL PRIMARY KEY,
  "email"      TEXT NOT NULL,
  "password"   TEXT NOT NULL,
  "name"       TEXT NOT NULL,
  "role"       TEXT NOT NULL DEFAULT 'customer',
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT "users_email_key" UNIQUE ("email"),
  CONSTRAINT "users_role_check" CHECK ("role" IN ('customer', 'admin'))
);

CREATE TABLE "categories" (
  "id"          SERIAL PRIMARY KEY,
  "name"        TEXT NOT NULL,
  "description" TEXT,
  CONSTRAINT "categories_name_key" UNIQUE ("name")
);

CREATE TABLE "products" (
  "id"          SERIAL PRIMARY KEY,
  "name"        TEXT NOT NULL,
  "description" TEXT,
  "price"       DECIMAL(10, 2) NOT NULL,
  "stock"       INTEGER NOT NULL DEFAULT 0,
  "created_at"  TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT "products_price_check" CHECK ("price" > 0),
  CONSTRAINT "products_stock_check" CHECK ("stock" >= 0)
);

CREATE TABLE "product_categories" (
  "product_id"  INTEGER NOT NULL,
  "category_id" INTEGER NOT NULL,
  CONSTRAINT "product_categories_pkey" PRIMARY KEY ("product_id", "category_id"),
  CONSTRAINT "product_categories_product_id_fkey"  FOREIGN KEY ("product_id")  REFERENCES "products"("id")   ON DELETE CASCADE,
  CONSTRAINT "product_categories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE
);

CREATE TABLE "carts" (
  "id"         SERIAL PRIMARY KEY,
  "user_id"    INTEGER NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT "carts_user_id_key" UNIQUE ("user_id"),
  CONSTRAINT "carts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
);

CREATE TABLE "cart_items" (
  "id"         SERIAL PRIMARY KEY,
  "cart_id"    INTEGER NOT NULL,
  "product_id" INTEGER NOT NULL,
  "quantity"   INTEGER NOT NULL,
  CONSTRAINT "cart_items_cart_id_product_id_key" UNIQUE ("cart_id", "product_id"),
  CONSTRAINT "cart_items_quantity_check" CHECK ("quantity" > 0),
  CONSTRAINT "cart_items_cart_id_fkey"    FOREIGN KEY ("cart_id")    REFERENCES "carts"("id")    ON DELETE CASCADE,
  CONSTRAINT "cart_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id")
);

CREATE TABLE "orders" (
  "id"         SERIAL PRIMARY KEY,
  "user_id"    INTEGER NOT NULL,
  "status"     TEXT NOT NULL DEFAULT 'pending',
  "total"      DECIMAL(10, 2) NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT "orders_status_check" CHECK ("status" IN ('pending','paid','shipped','delivered','cancelled')),
  CONSTRAINT "orders_total_check"  CHECK ("total" >= 0),
  CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id")
);

CREATE TABLE "order_items" (
  "id"               SERIAL PRIMARY KEY,
  "order_id"         INTEGER NOT NULL,
  "product_id"       INTEGER NOT NULL,
  "quantity"         INTEGER NOT NULL,
  "price_at_purchase" DECIMAL(10, 2) NOT NULL,
  CONSTRAINT "order_items_quantity_check" CHECK ("quantity" > 0),
  CONSTRAINT "order_items_order_id_fkey"   FOREIGN KEY ("order_id")   REFERENCES "orders"("id")   ON DELETE CASCADE,
  CONSTRAINT "order_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id")
);

CREATE TABLE "reviews" (
  "id"         SERIAL PRIMARY KEY,
  "user_id"    INTEGER NOT NULL,
  "product_id" INTEGER NOT NULL,
  "rating"     INTEGER NOT NULL,
  "comment"    TEXT,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT "reviews_user_id_product_id_key" UNIQUE ("user_id", "product_id"),
  CONSTRAINT "reviews_rating_check" CHECK ("rating" BETWEEN 1 AND 5),
  CONSTRAINT "reviews_user_id_fkey"    FOREIGN KEY ("user_id")    REFERENCES "users"("id")    ON DELETE CASCADE,
  CONSTRAINT "reviews_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE
);


