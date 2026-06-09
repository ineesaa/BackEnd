const express = require("express");
const path = require("path");

const router = express.Router();
const { readData, writeData } = require("../utils/fileHandler");

const productsFile = path.join(__dirname, "../data/products.json");

const adminMiddleware = require("../middlewares/adminMiddleware.js");

router.get("/", async (req, res) => {
  const products = await readData(productsFile);
  res.json(products);
});


router.get("/:id", async (req, res) => {
  const products = await readData(productsFile);

  const product = products.find(
    p => p.id === parseInt(req.params.id)
  );

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json(product);
});


router.post("/", adminMiddleware, async (req, res) => {
  const { name, description, price, stock_quantity } = req.body;

  if (!name || !price) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const products = await readData(productsFile);

  const newProduct = {
    id: products.length > 0 ? products[products.length - 1].id + 1 : 1,
    name,
    description,
    price,
    stock_quantity
  };

  products.push(newProduct);

  await writeData(productsFile, products);

  res.status(201).json(newProduct);
});


router.put("/:id", adminMiddleware, async (req, res) => {
  const products = await readData(productsFile);

  const index = products.findIndex(
    p => p.id === parseInt(req.params.id)
  );

  if (index === -1) {
    return res.status(404).json({ message: "Product not found" });
  }

  products[index] = {
    ...products[index],
    ...req.body
  };

  await writeData(productsFile, products);

  res.json(products[index]);
});


router.delete("/:id", adminMiddleware, async (req, res) => {
  let products = await readData(productsFile);

  products = products.filter(
    p => p.id !== parseInt(req.params.id)
  );

  await writeData(productsFile, products);

  res.json({ message: "Product deleted" });
});

module.exports = router;