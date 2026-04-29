function generateId() {
    return 'User_' + Math.floor(Math.random() * 10000);
  }
  
  function broadcastMessage(sender, message, clients) {
    for (const client of clients) {
      if (client !== sender) {
        client.write(message);
      }
    }
  }
  
  module.exports = { generateId, broadcastMessage };
