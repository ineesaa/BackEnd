const net = require('net');
const readline = require('readline');

const PORT = process.env.PORT || 3001;
const HOST = '127.0.0.1';

const client = net.createConnection(PORT, HOST, () => {
  console.log('Connected to chat server.');
  process.stdout.write('> ');
});

client.on('data', (data) => {
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  console.log(data.toString());
  process.stdout.write('> ');
});

client.on('end', () => {
  console.log('The user left');
  process.exit(0);
});

client.on('error', (err) => {
  console.log('Connection error:', err.message);
  process.exit(1);
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '> '
});

rl.on('line', (input) => {
  client.write(input);
  process.stdout.write('> ');
});

rl.on('SIGINT', () => {
  console.log('\nExiting chat...');
  client.end();
  process.exit(0);
});
