import * as http from 'http';
import * as socketio from 'socket.io';
import { connect_database } from './database';
import { Message } from '../models/Message';

// Creation serveur
const server = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World!\n');
});

connect_database(); 

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

        Message.find({ room: data})
            .then(messages => {
                socket.emit("room_history", messages); 
            })
            .catch(err => console.error('Error retrieving messages', err)); 

    }); 

    socket.on("send_message", (data) => {

        const newMessage = new Message(data); 
        newMessage.save()
            .then(() => console.log ("Message saved"))
            .catch(err => console.error("Error saving message", err))
        
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