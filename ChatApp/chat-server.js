const net = require('net');
const readline = require('readline');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Պորտը .env-ից
const PORT = process.env.PORT || 3001;
const MAX_CLIENTS = parseInt(process.env.MAX_CLIENTS) || 10;

// Clients պահելու համար
const clients = new Map();

// Helper logger
function logEvent(msg) {
  const logFile = process.env.LOG_FILE || 'logs/chat.log';
  const time = new Date().toISOString();
  fs.appendFileSync(logFile, `[${time}] ${msg}\n`);
}

// Broadcast function
function broadcast(sender, message) {
  for (const [id, socket] of clients) {
    if (socket !== sender) {
      socket.write(`${id}: ${message}\n> `);
    }
  }
}

// Create server
const server = net.createServer((socket) => {
  if (clients.size >= MAX_CLIENTS) {
    socket.write('Server is full, try again later.\n');
    socket.end();
    return;
  }

  const userId = `User_${Math.floor(Math.random()*10000)}`;
  socket.id = userId;
  clients.set(userId, socket);

  socket.write(`Welcome ${userId}!\n> `);
  broadcast(socket, `${userId} joined the chat`);
  logEvent(`${userId} joined`);

  socket.on('data', (data) => {
    const msg = data.toString().trim();
    if (!msg) return;
    if (msg.startsWith('@')) {
      const spaceIndex = msg.indexOf(' ');
      const target = msg.slice(1, spaceIndex);
      const text = msg.slice(spaceIndex + 1);
      if (clients.has(target)) {
        clients.get(target).write(`${socket.id} (private): ${text}\n> `);
        socket.write(`${socket.id} -> ${target}: ${text}\n> `);
        logEvent(`${socket.id} -> ${target}: ${text}`);
      } else {
        socket.write(`User ${target} does not exist\n> `);
      }
    } else {
      broadcast(socket, msg);
      socket.write(`${socket.id} -> ALL: ${msg}\n> `);
      logEvent(`${socket.id} -> ALL: ${msg}`);
    }
  });

  socket.on('close', () => {
    clients.delete(userId);
    broadcast(socket, `${userId} left the chat`);
    logEvent(`${userId} left`);
  });

  socket.on('error', (err) => {
    console.log(`Error with ${userId}:`, err.message);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
