const { WebSocketServer } = require('ws');

const sockserver = new WebSocketServer({ port: 8080 });

sockserver.on('connection', function connecte(ws) {
    console.log('New client connected!');
    ws.send(JSON.stringify({ sender: 'Server', message: 'Connexion établie' }));

    ws.on('close', function () {
        console.log('Client has disconnected!');
    });

    ws.on('message', function (data) {
        const messageData = JSON.parse(data);
        console.log("Message received: ", messageData);

        if (messageData.type === 'initialization') {
            console.log(`User initialized with pseudo: ${messageData.pseudo} and color: ${messageData.color}`);
        }

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
