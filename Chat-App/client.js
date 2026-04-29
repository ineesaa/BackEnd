const net = require('net');
const readline = require('readline');
const client = net.createConnection({port: 3000});
const rl = readline.createInterface({

    input: process.stdin,
    output: process.stdout
})

client.on('data', (data) => {
    console.log(data.toString());

});
rl.on('line', (input) => {
    client.write(input);
});