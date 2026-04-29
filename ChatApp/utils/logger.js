const fs = require('fs');
const path = require('path');
const logFile = process.env.LOG_FILE || 'logs/chat.log';

function logEvent(message) {
  const timestamp = new Date().toISOString();
  fs.appendFileSync(logFile, `[${timestamp}] ${message}\n`);
}

module.exports = { logEvent };
