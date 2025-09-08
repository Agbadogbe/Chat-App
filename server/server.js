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




<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Gestion de la Souris</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      text-align: center;
      margin-top: 30px;
    }

    button {
      padding: 10px 20px;
      font-size: 16px;
      cursor: pointer;
    }

    .rectangle {
      width: 400px;
      height: 300px;
      background-color: royalblue;
      border-radius: 15px;
      margin: 30px auto;
      transition: background-color 0.4s ease;
      display: block;
    }

    .good {
      background-color: limegreen !important;
    }

    .important {
      background-color: firebrick !important;
    }

    .hidden {
      display: none;
    }
  </style>
</head>
<body>

  <h1>Gestion de la Souris</h1>

  <button id="toggle-rectangle">Cacher / Afficher le rectangle</button>

  <p>✔ Déplacez la souris à l'intérieur du rectangle : il devient <b>rouge</b>.</p>
  <p>✔ Sortez la souris du rectangle : il redevient <b>bleu</b>.</p>
  <p>✔ Double-cliquez sur le rectangle : il devient <b>vert</b>.</p>
  <p>✔ Cliquez sur le bouton ci-dessus pour cacher ou afficher le rectangle.</p>

  <div class="rectangle"></div>

  <script>
    const btn = document.getElementById("toggle-rectangle");
    const rect = document.querySelector(".rectangle");

    // Bouton cacher / afficher
    btn.addEventListener("click", () => {
      rect.classList.toggle("hidden");
    });

    // Survol de la souris → rouge
    rect.addEventListener("mouseenter", () => {
      rect.classList.add("important");
    });

    rect.addEventListener("mouseleave", () => {
      rect.classList.remove("important");
      rect.classList.remove("good"); // repasse au bleu
    });

    // Double-clic → vert
    rect.addEventListener("dblclick", () => {
      rect.classList.add("good");
      rect.classList.remove("important");
    });
  </script>

</body>
</html>
