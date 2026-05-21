# Basic Authentication Task

This project demonstrates HTTP Basic Authentication using Node.js and Express.

## Requirements

- Node.js
- Express

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

## Example Requests

### Public Route

```bash
curl http://localhost:3001/
```

Response:

```json
{
  "message": "Public route. Everyone can access this."
}
```

---

### Protected Route (Success)

```bash
curl -u Elon:12345 http://localhost:3001/profile
```

Response:

```json
{
  "message": "Welcome Elon",
  "user": "Elon"
}
```

---

### Protected Route (Failed)

```bash
curl http://localhost:3001/profile
```

Response:

```json
{
  "message": "Authentication required"
}
```

---

### Protected Route with Invalid Credentials

```bash
curl -u Elon:wrongpassword http://localhost:3001/profile
```

Response:

```json
{
  "message": "Invalid username or password"
}
```

---

### Items Route

```bash
curl -u Bill:password http://localhost:3001/items
```

Response:

```json
{
  "items": [
    "Laptop",
    "Phone",
    "Keyboard",
    "Mouse"
  ]
}
```

## Reflection Questions

### Why is Base64 not considered a security measure?

Base64 only encodes information. It does not encrypt usernames and passwords, so anyone can decode it.

### What is the purpose of the WWW-Authenticate header?

It tells the browser that authentication is required and helps display a login prompt.

### In what situations is Basic Auth acceptable?

Basic Auth is acceptable for testing, internal systems, development tools, and APIs protected with HTTPS.