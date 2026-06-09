const express = require("express");
const path = require("path");

const router = express.Router();

const { readData, writeData } = require("../utils/fileHandler");

const cartsFile = path.join(__dirname, "../data/carts.json");
const ordersFile = path.join(__dirname, "../data/orders.json");
const productsFile = path.join(__dirname, "../data/products.json");

router.post("/:user_id", async (req, res) => {
  const userId = parseInt(req.params.user_id);
  const carts = await readData(cartsFile);
  const products = await readData(productsFile);
  const orders = await readData(ordersFile);

  const cart = carts.find(c => c.user_id === userId);

  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  let totalAmount = 0;
  const orderItems = [];
  for (let item of cart.items) {
    const product = products.find(p => p.id === item.product_id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.stock_quantity < item.quantity) {
      return res.status(400).json({
        message: `Not enough stock for ${product.name}`
      });
    }

    totalAmount += product.price * item.quantity;

    orderItems.push({
      product_id: product.id,
      quantity: item.quantity,
      price_at_purchase: product.price
    });
    product.stock_quantity -= item.quantity;
  }

  const newOrder = {
    id: orders.length > 0 ? orders[orders.length - 1].id + 1 : 1,
    user_id: userId,
    order_date: new Date().toISOString(),
    total_amount: totalAmount,
    status: "pending",
    items: orderItems
  };

  orders.push(newOrder);

  cart.items = [];

  await writeData(productsFile, products);
  await writeData(ordersFile, orders);
  await writeData(cartsFile, carts);

  res.status(201).json(newOrder);
});


router.get("/:user_id", async (req, res) => {
  const orders = await readData(ordersFile);

  const userOrders = orders.filter(
    o => o.user_id === parseInt(req.params.user_id)
  );

  res.json(userOrders);
});


router.get("/single/:id", async (req, res) => {
  const orders = await readData(ordersFile);

  const order = orders.find(
    o => o.id === parseInt(req.params.id)
  );

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  res.json(order);
});


router.put("/:id/status", async (req, res) => {
  const { status } = req.body;

  const allowed = ["pending", "shipped", "delivered", "cancelled"];

  if (!allowed.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const orders = await readData(ordersFile);

  const order = orders.find(
    o => o.id === parseInt(req.params.id)
  );

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  order.status = status;

  await writeData(ordersFile, orders);

  res.json(order);
});

module.exports = router;