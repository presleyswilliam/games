const express = require('express');
const path = require('path');
const WebSocket = require('ws');
const app = express();
const PORT = process.env.PORT || 9000;

app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const server = app.listen(PORT);
const socket = new WebSocket.Server({ server });

app.use(express.json({}));

socket.on('connection', (socket) => {
  console.log('Client connected');
  socket.send(JSON.stringify( { message: `Hello World! You have connected to the server's WebSocket!` } ));
  socket.on('close', () => console.log('Client disconnected'));
});