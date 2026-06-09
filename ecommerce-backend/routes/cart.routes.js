const express = require("express");
const path = require("path");

const router = express.Router();

const { readData, writeData } = require("../utils/fileHandler");

const cartsFile = path.join(__dirname, "../data/carts.json");
const productsFile = path.join(__dirname, "../data/products.json");

router.get("/:user_id", async (req, res) => {
  const carts = await readData(cartsFile);

  const cart = carts.find(
    c => c.user_id === parseInt(req.params.user_id)
  );

  if (!cart) {
    return res.json({ user_id: req.params.user_id, items: [] });
  }

  res.json(cart);
});

router.post("/:user_id", async (req, res) => {
  const { product_id, quantity } = req.body;

  const carts = await readData(cartsFile);
  const products = await readData(productsFile);

  const product = products.find(p => p.id === product_id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  let cart = carts.find(
    c => c.user_id === parseInt(req.params.user_id)
  );

  if (!cart) {
    cart = {
      id: carts.length > 0 ? carts[carts.length - 1].id + 1 : 1,
      user_id: parseInt(req.params.user_id),
      items: []
    };
    carts.push(cart);
  }

  const existingItem = cart.items.find(
    i => i.product_id === product_id
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({
      product_id,
      quantity
    });
  }

  await writeData(cartsFile, carts);

  res.json(cart);
});

router.delete("/:user_id/items/:product_id", async (req, res) => {
  const carts = await readData(cartsFile);

  const cart = carts.find(
    c => c.user_id === parseInt(req.params.user_id)
  );

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  cart.items = cart.items.filter(
    i => i.product_id !== parseInt(req.params.product_id)
  );

  await writeData(cartsFile, carts);

  res.json(cart);
});

router.delete("/:user_id", async (req, res) => {
  const carts = await readData(cartsFile);

  const cart = carts.find(
    c => c.user_id === parseInt(req.params.user_id)
  );

  if (!cart) {
    return res.json({ message: "Cart already empty" });
  }

  cart.items = [];

  await writeData(cartsFile, carts);

  res.json({ message: "Cart cleared" });
});

module.exports = router;