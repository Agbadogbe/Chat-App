import express from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import bodyParser from 'body-parser';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import mongoose from 'mongoose';
import loginRoute from './routes/login.js';
import registerRoute from './routes/register.js';
import Message from './model/Message.js';
import userRoute from './routes/user.js';
import messagesRoute from './routes/message.js';

const app = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const hostname = '127.0.0.1';
const port = 8080;

mongoose.connect('mongodb+srv://Imhotep:qwertyuiop22@cluster0.gu7d5az.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connexion à MongoDB réussie'))
  .catch(err => console.error('Erreur de connexion à MongoDB', err));

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());

app.use('/login', loginRoute);
app.use('/register', registerRoute);
app.use('/user', userRoute);
app.use('/messages', messagesRoute);

app.get('/', (req, res) => {
  res.status(200).send("Chat-app main page");
});

app.get('/about.json', (req, res) => {
  res.status(200).send("List of Actions and REActions");
});

let activeRooms = {};

io.on('connection', (socket) => {
  console.log(`Un client est connecté: ${socket.id}`);

  socket.on('create room', (roomName) => {

    socket.join(roomName);
    console.log(`Room ${roomName} créée et utilisateur ${socket.id} a rejoint la room`);

    io.emit('rooms list', Array.from(io.sockets.adapter.rooms.keys()));
  });

  socket.on('join room', (roomName) => {
    socket.join(roomName);
    console.log(`Utilisateur ${socket.id} a rejoint la room: ${roomName}`);
    io.to(roomName).emit('user joined', socket.id);
  });

  socket.on('leave room', (roomName) => {
    socket.leave(roomName);
    console.log(`Utilisateur ${socket.id} a quitté la room: ${roomName}`);
    io.to(roomName).emit('user left', socket.id);
  });

  socket.on('chat message', (msg) => {

    msg.socketId = socket.id;
    
    const messageToSave = new Message(msg);
    messageToSave.save()
      .then(() => {
    
        io.to(msg.room).emit('chat message', msg);
      })
      .catch(err => console.error(err));
  });
  
  socket.on('disconnect', () => {
    console.log(`Client déconnecté: ${socket.id}`);
  
    for (const roomName in activeRooms) {
      activeRooms[roomName]?.delete(socket.id);
      if (activeRooms[roomName]?.size === 0) {
        delete activeRooms[roomName];
      }
    }
  });
});

httpServer.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
