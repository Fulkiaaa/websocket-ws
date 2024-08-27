const { WebSocketServer } = require('ws');

const sockserver = new WebSocketServer({ port: 8080 });

sockserver.on('connection', function connecte(ws) {
    console.log('New client connected!');

    let clientPseudo = '';

    ws.on('message', function (data) {
        const messageData = JSON.parse(data);

        if (messageData.type === 'join') {
            clientPseudo = messageData.sender;
            console.log(`${clientPseudo} has joined the chat.`);

            ws.send(JSON.stringify({
                sender: 'Server',
                message: `Bienvenue sur le chat, ${clientPseudo} !`,
                color: '#000000',
                type: 'welcome'
            }));

            sockserver.clients.forEach(client => {
                if (client.readyState === client.OPEN && client !== ws) {
                    client.send(JSON.stringify({
                        sender: 'Server',
                        message: `${clientPseudo} est arrivé !`,
                        color: '#000000',
                        type: 'announcement'
                    }));
                }
            });

        } else if (messageData.type === 'leave') {
            console.log(`${clientPseudo} has left the chat.`);

            sockserver.clients.forEach(client => {
                if (client.readyState === client.OPEN) {
                    client.send(JSON.stringify({
                        sender: 'Server',
                        message: `${clientPseudo} a quitté le chat.`,
                        color: '#000000',
                        type: 'announcement'
                    }));
                }
            });
        } else {
            console.log("Message received: ", messageData);

            sockserver.clients.forEach(client => {
                if (client.readyState === client.OPEN) {
                    client.send(JSON.stringify(messageData));
                }
            });
        }
    });

    ws.on('close', function () {
        console.log('Client has disconnected!');
        if (clientPseudo) {
            sockserver.clients.forEach(client => {
                if (client.readyState === client.OPEN) {
                    client.send(JSON.stringify({
                        sender: 'Server',
                        message: `${clientPseudo} a quitté le chat.`,
                        color: '#000000',
                        type: 'announcement'
                    }));
                }
            });
        }
    });

    ws.on('error', function () {
        console.log('WebSocket error');
    });
});
