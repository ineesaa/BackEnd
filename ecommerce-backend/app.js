const express = require("express");

const usersRoutes = require("./routes/users.routes");
const productsRoutes = require("./routes/products.routes");
const cartRoutes = require("./routes/cart.routes");
const ordersRoutes = require("./routes/orders.routes");

const app = express();

app.use(express.json());

app.use("/api/users", usersRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", ordersRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API running" });
});

app.listen(3000, () => {
  console.log("Server running");
});