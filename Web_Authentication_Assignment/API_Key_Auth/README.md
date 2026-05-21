# API Key Authentication Task

This project demonstrates API Key Authentication using Node.js and Express.

## Requirements

- Node.js
- Express
- Dotenv

## Installation

Install dependencies:

```bash
npm install
```

Run the server:

```bash
node server.js
```

The server runs on:

```txt
http://localhost:3001
```

## Environment Variables

Create a `.env` file and add:

```env
PORT=3001

CLIENT_1_KEY=abc123secret
CLIENT_2_KEY=xyz456secret
CLIENT_3_KEY=qwe789secret
```

## Example Requests

### Public Route

```bash
curl http://localhost:3001/
```

Response:

```json
{
  "status": "Server is running"
}
```

---

### Get Products (Read Permission)

```bash
curl -H "X-API-Key: abc123secret" http://localhost:3001/products
```

Response:

```json
[
  {
    "id": 1,
    "name": "Laptop",
    "price": 1500
  },
  {
    "id": 2,
    "name": "Phone",
    "price": 900
  },
  {
    "id": 3,
    "name": "Keyboard",
    "price": 120
  }
]
```

---

### Create Product (Write Permission)

```bash
curl -X POST http://localhost:3001/products \
-H "Content-Type: application/json" \
-H "X-API-Key: xyz456secret" \
-d "{\"name\":\"Monitor\",\"price\":300}"
```

Response:

```json
{
  "id": 123456789,
  "name": "Monitor",
  "price": 300
}
```

---

### Missing API Key

```bash
curl http://localhost:3001/products
```

Response:

```json
{
  "message": "API key is missing"
}
```

---

### Invalid API Key

```bash
curl -H "X-API-Key: wrongkey" http://localhost:3001/products
```

Response:

```json
{
  "message": "Invalid API key"
}
```

---

### Permission Denied

```bash
curl -X POST http://localhost:3001/products \
-H "Content-Type: application/json" \
-H "X-API-Key: abc123secret" \
-d "{\"name\":\"Monitor\",\"price\":300}"
```

Response:

```json
{
  "message": "Access denied"
}
```

## Reflection Questions

### How is API key authentication different from Basic Auth?

Basic Auth uses a username and password, while API key authentication uses a unique key to identify a client or application.

### Why is API key authentication usually a poor choice for user-facing applications?

API keys can be exposed or stolen and do not provide user-based authentication.

### What strategies can be used to keep API keys safe and revoke them when leaked?

API keys should be stored in environment variables, rotated regularly, restricted by permissions, and revoked if leaked.