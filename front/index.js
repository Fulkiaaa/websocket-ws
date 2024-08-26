const webSocket = new WebSocket('ws://localhost:8080/');
let pseudo = '';
let color = '#000000'; // Couleur par défaut

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function initializeUser() {
    pseudo = document.getElementById('pseudo').value.trim();
    if (!pseudo) {
        alert("Un pseudo est nécessaire pour utiliser la messagerie.");
        return;
    }

    color = getRandomColor();

    document.getElementById('messages').innerHTML += `Vous êtes maintenant connecté en tant que <b style="color:${color}">${pseudo}</b>.<br>`;

    document.getElementById('initialization').style.display = 'none';
    document.getElementById('form').style.display = 'block';
}

function sendMessage() {
    if (!pseudo) {
        alert("Veuillez entrer un pseudo !");
        return;
    }

    const messageInput = document.getElementById('message');
    const message = messageInput.value.trim();
    
    if (message) {
        webSocket.send(JSON.stringify({ sender: pseudo, message: message, color: color }));
        messageInput.value = '';
    }
}

webSocket.onmessage = function (event) {
    const { sender, message, color, type } = JSON.parse(event.data);

    if (type === 'welcome' || type === 'announcement') {
        document.getElementById('messages').innerHTML += `<b style="color:${color}">${sender}:</b> ${message}<br>`;
    } else {
        document.getElementById('messages').innerHTML += `<b style="color:${color}">${sender}:</b> ${message}<br>`;
    }

    document.getElementById('messages').scrollTop = document.getElementById('messages').scrollHeight;
};

webSocket.onopen = function (event) {
    console.log("Connected to WebSocket server.");
};

webSocket.onerror = function (error) {
    console.error("WebSocket error: ", error);
};

webSocket.onclose = function (event) {
    if (!event.wasClean) {
        document.getElementById('messages').innerHTML += `<b style="color:#000000">Server:</b> La connexion a été perdue.<br>`;
    }
};

document.getElementById('send').addEventListener('click', function () {
    sendMessage();
});

document.getElementById('initialize').addEventListener('click', initializeUser);

document.getElementById('pseudo').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        initializeUser();
    }
});

document.getElementById('message').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

document.getElementById('disconnect').addEventListener('click', function () {
    webSocket.close();
    document.getElementById('messages').innerHTML += `<b style="color:#000000">Server:</b> Vous avez été déconnecté.<br>`;
    document.getElementById('initialization').style.display = 'block';
    document.getElementById('form').style.display = 'none';
});
