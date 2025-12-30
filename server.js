const express = require('express');
const app = express();
require('dotenv').config();
const http = require('http');
const database = require('./db/database');
const authRoute = require('./routes/authroute');
const socketIo = require("socket.io");
const message = require('./models/messeage.model');
const cookieParser = require('cookie-parser');
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Create HTTP server and bind Socket.io
const server = http.createServer(app);
const io = socketIo(server);

// Socket.io events
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('chat message', async (data) => {
        const newmessage = new message({
            username: data.username,
            message: data.message
        });
        await newmessage.save();
        io.emit('chat message', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Routes
app.use('/auth', authRoute);
app.get('/', (req, res) => {
  res.redirect('/auth/register');
});


// ✅ Important: listen with `server` not `app`
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
