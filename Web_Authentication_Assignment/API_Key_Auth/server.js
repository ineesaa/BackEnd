const express = require("express")
require("dotenv").config()
const app = express()
const PORT = process.env.PORT || 3001
app.use(express.json())

const clients = [
  {
    name: "Client One",
    apiKey: process.env.CLIENT_1_KEY,
    permissions: ["read"],
  },
  {
    name: "Client Two",
    apiKey: process.env.CLIENT_2_KEY,
    permissions: ["read", "write"],
  },
  {
    name: "Client Three",
    apiKey: process.env.CLIENT_3_KEY,
    permissions: ["write"],
  },
]

function authenticateApiKey(req, res, next) {
  const apiKey = req.header("X-API-Key");

  if (!apiKey) {
    return res.status(401).json({
      message: "API key is missing",
    })
  }

  const client = clients.find(
    (client) => client.apiKey === apiKey
  )

  if (!client) {
    return res.status(401).json({
      message: "Invalid API key",
    })
  }
  req.client = client

  next()
}

function requirePermission(permission) {
  return (req, res, next) => {
    const hasPermission =
      req.client.permissions.includes(permission);

    if (!hasPermission) {
      return res.status(403).json({
        message: "Access denied",
      })
    }

    next();
  }
}

app.get("/", (req, res) => {
  res.json({
    status: "Server is running",
  })
})

app.get(
  "/products",
  authenticateApiKey,
  requirePermission("read"),
  (req, res) => {
    const products = [
      {
        id: 1,
        name: "Laptop",
        price: 1500,
      },
      {
        id: 2,
        name: "Phone",
        price: 900,
      },
      {
        id: 3,
        name: "Keyboard",
        price: 120,
      },
    ]
    res.json(products);
  }
)




app.post(
  "/products",
  authenticateApiKey,
  requirePermission("write"),
  (req, res) => {
    const { name, price } = req.body;
    const newProduct = {
      id: Date.now(),
      name,
      price,
    }
    res.status(201).json(newProduct);
  }
)
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})