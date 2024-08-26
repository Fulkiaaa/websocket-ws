const { WebSocketServer } = require('ws');

const sockserver = new WebSocketServer({ port: 8080 });

sockserver.on('connection', function connecte(ws) {
    console.log('New client connected!');
    
    ws.send(JSON.stringify({
        sender: 'Server',
        message: 'Bienvenue sur le chat !',
        color: '#000000',
        type: 'welcome'
    }));

    sockserver.clients.forEach(client => {
        if (client.readyState === client.OPEN && client !== ws) {
            client.send(JSON.stringify({
                sender: 'Server',
                message: 'Un nouveau participant est arrivé !',
                color: '#000000',
                type: 'announcement'
            }));
        }
    });

    ws.on('close', function () {
        console.log('Client has disconnected!');
        sockserver.clients.forEach(client => {
            if (client.readyState === client.OPEN) {
                client.send(JSON.stringify({
                    sender: 'Server',
                    message: 'Un participant a quitté le chat.',
                    color: '#000000',
                    type: 'announcement'
                }));
            }
        });
    });

    ws.on('message', function (data) {
        const messageData = JSON.parse(data);
        console.log("Message received: ", messageData);

        sockserver.clients.forEach(client => {
            if (client.readyState === client.OPEN) {
                client.send(JSON.stringify(messageData));
            }
        });
    });

    ws.on('error', function () {
        console.log('WebSocket error');
    });
});
