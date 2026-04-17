function formatLog(message) {
    const date = new Date();
    const timestamp = date.toISOString();
  
    return `[${timestamp}] ${message}\n`
  }
  module.exports = formatLog;