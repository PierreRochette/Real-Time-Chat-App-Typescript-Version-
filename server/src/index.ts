import * as http from 'http';
import * as socketio from 'socket.io';

// Creation serveur
const server = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World!\n');
});

// Instanciation socket.io
const io = new socketio.Server();

// Socket.io sur 3001
io.attach(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

// Connexion
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on("join_room", (data) => {
        socket.join(data); 
        console.log(`User with id: ${socket.id} joined room: ${data}`); 
    }); 

    socket.on("send_message", (data) => {
        socket.to(data.room).emit("receive_message", data); 
        console.log(data); 
    }); 

    // Gestion des événements socket
    socket.on('disconnect', () => {
        console.log('User disconnected :', socket.id);
    });
});

// Démarrage du serveur HTTP sur le port 3000
const PORT = 3001;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});