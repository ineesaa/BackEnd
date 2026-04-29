const net = require('net');

const clients = new Map();
const max_clients = 5;

const server = net.createServer((socket) => {

    if(clients.size >= max_clients){
        socket.write("server is full");
        socket.destroy();
        return;
    }


    socket.write(" Please enter your name: ");
    let username = '';
    socket.on('data', (data) => {
        const message = data.toString().trim();
        if(!username ){
            username = message;
            clients.set(username, socket);
            broadcast(`${username} joined chat`, username);
            return;
        }

        if(message.startsWith('/dm')){
            const parts = message.split(' ');
            const targetUser = parts[1];
            const dmmes = parts.slice(2).join(' ');

            if(clients.has(targetUser)){
                clients.get(targetUser).write(` DM from ${username} ${dmmes}\n`);
            }
            else{
                socket.write('User not found');
            }
            return;
        }

        broadcast(` ${username}: ${message}, username`);
    });

    socket.on('close', () => {
        if(username){
            clients.delete(username);
            broadcast(`${username} left the chat`);
        }
    });


})

function broadcast(message, sender){
    for(let [name, sock] of clients){
        if(name !== sender){
            sock.write(message);
        }
    }
}

server.listen(3000, () => {
    console.log("Server runing on port 3000");
})