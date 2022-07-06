const express = require('express');
const path = require('path');
const { instrument } = require('@socket.io/admin-ui');  // https://admin.socket.io/#/
const socketIO = require('socket.io');  // https://socket.io/docs/v4/server-api/
const app = express();
const PORT = process.env.PORT || 9000;
const Sequence = require('./src/GameDefinitions/Sequence');

app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const server = app.listen(PORT);
const io = socketIO(server, {
  cors: {
    origin: ["https://admin.socket.io"],
    credentials: true
  }
});

instrument(io, {  // Server URL: http://localhost:9000, u: admin, pass: pswiopass
  auth: {
    type: "basic",
    username: "admin",
    password: "$2a$10$EwMc/jsMWNv8sq6TW0hAtewJRQP/Gihy.WF8wyu5rimSjxeh0F7a6" // "pswiopass" encrypted with bcrypt 10, https://bcrypt-generator.com/
  },
});

app.use(express.json({}));



/*** SocketIO Variables ***/
var activeGames = {};  // { lobbyName: gameObj }
// setInterval(() => {  // Prints activeGames
//   let count = 0;
//   let str = '';
//   str += '{ ';
//   for (const [key, value] of Object.entries(activeGames)) {
//     if (count > 0) { str += ', '; }
//     str += `${key}: ${value.gameType}`;
//     count++;
//   }
//   str += ' }';
//   console.log(str)
//   console.log(process.memoryUsage())
// }, 2000);


/*** SocketIO Functions ***/
function updateGameArray() {
  let lobbyNames = ioGetAllRoomNames();
  for (const [key, value] of Object.entries(activeGames)) {
    if (lobbyNames.includes(key) === false) {
      delete activeGames[key];
    }
  }
}

function ioGetAllRoomNames() {
  // Convert map into 2D list:
  // ==> [['4ziBKG9XFS06NdtVAAAH', Set(1)], ['room1', Set(2)], ...]
  const arr = Array.from(io.sockets.adapter.rooms);
  // Filter rooms whose name exist in set:
  // ==> [['room1', Set(2)], ['room2', Set(2)]]
  const filtered = arr.filter(room => !room[1].has(room[0]))
  // Return only the room name: 
  // ==> ['room1', 'room2']
  const res = filtered.map(i => i[0]);
  return res;
}

function setLobbyNames(lobbies) {
  let lobbyNames = ioGetAllRoomNames();
  for (let i = 0; i < lobbyNames.length; i++) {
    lobbies[lobbyNames[i]] = {};
  }
  return;
}

function setLobbyGameTypes(lobbies) {
  for (const [key, value] of Object.entries(lobbies)) {
    lobbies[key]['gameType'] = activeGames[key].gameType;
  }
  return;
}

function setNumJoined(lobbies) {
  for (const [key, value] of Object.entries(lobbies)) {
    let room = io.sockets.adapter.rooms.get(key);
    lobbies[key]['numJoined'] = room.size;
  }
}

function getActiveLobbies(socket, clientCallback) {
  let lobbies = {}; // { lobbyName0: { gameType0: <gameType0>, gameNumJoined0: <gameNumJoined0>, gameCapacity0: <gameCapacity0> } [,...{}] }
  
  /* Get all room names */
  setLobbyNames(lobbies);

  /* Get room type for each room name */
  setLobbyGameTypes(lobbies);

  /* Get number of people in lobby for each room */
  setNumJoined(lobbies);

  /* Send back to client */
  clientCallback(lobbies);
}

function newSequenceGame(socket, newRoomName, clientCallback) {
  /* Join lobby (creates if not existing already) */
  socket.join(newRoomName);
  activeGames[newRoomName] = new Sequence;

  /* Update object of room names and active games */

  /* Update lobbies on everyone's screen */
  io.emit('updateLobbies');

  clientCallback(newRoomName);
}

function handleDisconnect(socket) {
  io.emit('updateLobbies');
  updateGameArray();

  console.log(`Client ${socket.id} disconnected.`)
}

/*** SocketIO Logic ***/
io.on('connection', (socket) => {
  console.log(`Client ${socket.id} connected.`);
  
  socket.on("getActiveLobbies", (clientCallback) => { getActiveLobbies(socket, clientCallback); });
  socket.on("newSequenceGame", (roomName, clientCallback) => { newSequenceGame(socket, roomName, clientCallback); });
  
  socket.on('disconnect', () => { handleDisconnect(socket); });
});


/*** GENERAL FUNCTIONS ***/
