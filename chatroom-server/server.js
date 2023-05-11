const express = require('express');
const cors = require('cors');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: '*'
    }
});

// enable CORS for all routes
app.use(cors({
    origin: '*'
  }));
  

// serve static files
app.use(express.static('public'));

const messages = [];

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.emit('chat history', messages);

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// endpoint 1
app.get('/messages', (req, res) => {
  res.json(messages);
});

// endpoint 2
app.get('/latest-message', (req, res) => {
    res.json(messages[messages.length - 1]);
  });

  // endpoint 3
app.post('/messages', express.json(), (req, res) => {
  const message = { name: req.body.name, message: req.body.message };
  messages.push(message);
  io.emit('chat message', message);
  res.status(201).json({ message: 'Message added successfully' });
});

const port = process.env.PORT || 3000;
http.listen(port, () => {
  console.log(`listening on *:${port}`);
});
