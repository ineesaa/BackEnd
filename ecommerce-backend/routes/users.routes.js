const express = require("express");
const router = express.Router();
const path = require("path");

const { readData, writeData } = require("../utils/fileHandler");

const usersFile = path.join(__dirname, "../data/users.json");

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const users = await readData(usersFile);

    const existingUser = users.find(
      user =>
        user.username === username ||
        user.email === email
    );

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const newUser = {
      id:
        users.length > 0
          ? Math.max(...users.map(u => u.id)) + 1
          : 1,
      username,
      email,
      password,
      role: "customer"
    };

    users.push(newUser);

    await writeData(usersFile, users);

    res.status(201).json({
      message: "User registered successfully",
      user: newUser
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const users = await readData(usersFile);

    const user = users.find(
      u =>
        u.username === username &&
        u.password === password
    );

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    res.json({
      message: "Login successful",
      user_id: user.id,
      role: user.role
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

module.exports = router;