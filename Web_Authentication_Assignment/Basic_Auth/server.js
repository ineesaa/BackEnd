const express = require("express")
const app = express()
const PORT = 3001

app.use(express.json());

const users = [
  {
    username: "Elon",
    password: "12345",
  },
  {
    username: "Bill",
    password: "password",
  },
  {
    username: "Jordan",
    password: "qwerty",
  },
];

function basicAuth(req, res, next) {
  const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Basic ")) {
    res.set("WWW-Authenticate", 'Basic realm="Protected Area"');
    return res.status(401).json({
      message: "Authentication required",
    })
  }

  const encodedCredentials = authHeader.split(" ")[1];
  const decodedCredentials = Buffer.from(
    encodedCredentials,
    "base64"
  ).toString("utf-8");

  const [username, password] = decodedCredentials.split(":");

  const user = users.find(
    (u) =>
      u.username === username &&
      u.password === password
  )
  if (!user) {
    res.set("WWW-Authenticate", 'Basic realm="Protected Area"');

    return res.status(401).json({
      message: "Invalid username or password",
    })
  }

  req.user = user
  next()
}

app.get("/", (req, res) => {
  res.json({
    message: "Public route. Everyone can access this.",
  })
})
app.get("/profile", basicAuth, (req, res) => {
  res.json({
    message: `Welcome ${req.user.username}`,
    user: req.user.username,
  })
})
app.get("/items", basicAuth, (req, res) => {
  const items = [
    "Laptop",
    "Phone",
    "Keyboard",
    "Mouse",
  ]

  res.json({
    items,
  })
})
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})