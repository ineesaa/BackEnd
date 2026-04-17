const fs = require('fs');
const path = require('path');
const formatLog = require('./logger');
const logPath = path.join(__dirname, 'app.log');
const message = "Server started"
const logLine = formatLog(message)
fs.appendFileSync(logPath, logLine);

console.log("Log added!");