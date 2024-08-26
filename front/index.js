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

    document.getElementById('messages').innerHTML += `<b style="color:${color}">${pseudo}:</b> Vous êtes maintenant connecté.<br>`;

    document.getElementById('initialization').style.display = 'none';
    document.getElementById('form').style.display = 'block';
}

webSocket.onmessage = function (event) {
    const { sender, message, color } = JSON.parse(event.data);
    document.getElementById('messages').innerHTML += 
      `<b style="color:${color}">${sender}:</b> ${message}<br>`;
    document.getElementById('messages').scrollTop = document.getElementById('messages').scrollHeight;
};

webSocket.onopen = function (event) {
    console.log("Connected to WebSocket server.");
};

webSocket.onerror = function (error) {
    console.error("WebSocket error: ", error);
};

document.getElementById('send').addEventListener('click', function () {
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
});

document.getElementById('initialize').addEventListener('click', initializeUser);
