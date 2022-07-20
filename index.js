const express = require('express');
const path = require('path');
const { instrument } = require('@socket.io/admin-ui');  // https://admin.socket.io/#/
const socketIO = require('socket.io');  // https://socket.io/docs/v4/server-api/
const app = express();
const PORT = process.env.PORT || 9000;
const Sequence = require('./src/GameDefinitions/Sequence');
const TicTacToe = require('./src/GameDefinitions/TicTacToe');

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
io.eio.pingTimeout = 120000;  // 2 minutes
io.eio.pingInterval = 5000; // 5 seconds

instrument(io, {  // Server URL: http://localhost:9000, u: admin, pass: pswiopass
  auth: {
    type: "basic",
    username: "admin",
    password: "$2a$10$EwMc/jsMWNv8sq6TW0hAtewJRQP/Gihy.WF8wyu5rimSjxeh0F7a6" // "pswiopass" encrypted with bcrypt 10, https://bcrypt-generator.com/
  },
});

app.use(express.json({}));



/*** SocketIO Variables ***/
var activeGames = {}; // { lobbyName: { game: <game>, gameNumJoined: <gameNumJoined>, gameCapacity: <gameCapacity> } [,...{}] }
var abandonedGames = {}; // { lobbyName: { game: <game>, gameNumJoined: <gameNumJoined>, gameCapacity: <gameCapacity> } [,...{}] }



/*** SocketIO Functions ***/
function moveGameToActive(key) {
  if (!Object.hasOwn(abandonedGames, key)) { return; }
  clearTimeout(abandonedGames[key]['timeoutRef']);
  delete abandonedGames[key]['timeoutRef'];
  console.log('cleared timeout')
  // activeGames[key] = structuredClone(abandonedGames[key]);
  activeGames[key] = JSON.parse(JSON.stringify((abandonedGames[key])));
  delete abandonedGames[key];
}
function moveGameToAbandoned(key) {
  if (!Object.hasOwn(activeGames, key)) { return; }
  // abandonedGames[key] = structuredClone(activeGames[key]);
  abandonedGames[key] = JSON.parse(JSON.stringify((activeGames[key])));
  abandonedGames[key]['timeoutRef'] = setTimeout(() => {
    console.log('deleted')
    delete abandonedGames[key];
  }, 300000);  // 300000: 5min, 10000: 10sec
  delete activeGames[key];
}
function updateGameArray() {
  let lobbyNames = ioGetAllRoomNames();
  for (const [key, value] of Object.entries(activeGames)) {
    if (lobbyNames.includes(key) === false) {
      moveGameToAbandoned(key);
    }
  }
}

function ioGetAllRoomNames() {
  // Convert map into 2D list:
  // ==> [['4ziBKG9XFS06NdtVAAAH', Set(1)], ['room1', Set(2)], ...]
  const arr = Array.from(io.sockets.adapter.rooms);
  // Filter rooms whose name exist in set:
  // ==> [['room1', Set(2)], ['room2', Set(2)]]
  const filtered = arr.filter(room => !room[1].has(room[0]));
  // Return only the room name: 
  // ==> ['room1', 'room2']
  const rooms = filtered.map(i => i[0]);
  return rooms;
}

function getSocketRooms(socket) {
  const arr = Array.from(socket.rooms);
  const filtered = arr.filter(room => room !== socket.id);
  return filtered;
}

function getNumJoined(roomName) {
  let room = io.sockets.adapter.rooms.get(roomName);
  numJoined = room.size;
  return numJoined;
}

function getActiveLobbies(socket, clientCallback) {
  /* Update numJoined */
  for (const [key, value] of Object.entries(activeGames)) {
    activeGames[key]['numJoined'] = getNumJoined(key);
  }
  
  /* Get info from activeGames object */
  let modifiedActiveGames = {};
  let socketRooms = getSocketRooms(socket);
  for (const [key, value] of Object.entries(activeGames)) {
    /* name */
    modifiedActiveGames[key] = {};

    /* gameType */
    modifiedActiveGames[key]['gameType'] = activeGames[key]['game'].gameType;

    /* isStarted */
    modifiedActiveGames[key]['isStarted'] = activeGames[key]['game'].isStarted;

    /* numJoined */
    modifiedActiveGames[key]['numJoined'] = activeGames[key]['numJoined'];

    /* joined flag */
    let joined = false;
    if (socketRooms.includes(key)) { joined = true; }
    modifiedActiveGames[key]['joined'] = joined;
  }

  /* Send back to client */
  clientCallback(modifiedActiveGames);
}

function newGame(socket, gameType, newRoomName, clientCallback) {
  /* Leave current lobby if already in one */
  getSocketRooms(socket).forEach( (room) => { socket.leave(room); } );
  updateGameArray();

  /* Join lobby (creates if not existing already) */
  socket.join(newRoomName);

  /* Update object of room names and active games */
  if (gameType === 'Sequence') {
    activeGames[newRoomName] = { game: new Sequence };
  } else if (gameType === 'TicTacToe') {
    activeGames[newRoomName] = { game: new TicTacToe };
  }

  /* Add numJoined to object */
  activeGames[newRoomName]['numJoined'] = getNumJoined(newRoomName);

  /* Update lobbies on everyone's screen */
  io.emit('updateLobbies');

  clientCallback(newRoomName);
}

function joinGame(socket, roomName, clientCallback) {
  /* Join lobby */
  if (Object.hasOwn(activeGames, roomName) || Object.hasOwn(abandonedGames, roomName)) {
    /* Leave current lobby if already in one */
    getSocketRooms(socket).forEach( (room) => { socket.leave(room); } );
    updateGameArray();

    /* Join lobby */
    socket.join(roomName);

    /* Brings back expired game if on recently abandoned */
    moveGameToActive(roomName);
    
    /* Update lobbies on everyone's screen */
    io.emit('updateLobbies');
    
    clientCallback(roomName);
  } else {
    /* Return undefined if join unsucecssful */
    clientCallback(undefined);
  }
}

function startGame(socket, gameType, roomName) {
  activeGames[roomName]['game'].isStarted = true;
  io.to(roomName).emit('startingGame', gameType);
}

function handleDisconnect(socket) {
  updateGameArray();
  io.emit('updateLobbies');

  console.log(`Client ${socket.id} disconnected.`)
}

function getGameBoard(socket, roomName, clientCallback) {
  let gameboard = activeGames?.[roomName]?.['game']?.board;

  clientCallback(gameboard);
}

function setPiece(socket, roomName, coord, clientCallback) {
  // if checks for turn and valid placement are OK
  activeGames[roomName]['game'].board[coord[0]][coord[1]] = 'set';

  io.emit('updateGameboard');
}

/*** SocketIO Logic ***/
io.on('connection', (socket) => {
  console.log(`Client ${socket.id} connected.`);
  
  socket.on("getActiveLobbies", (clientCallback) => { getActiveLobbies(socket, clientCallback); });
  socket.on("updateLobbies", (clientCallback) => { io.emit('updateLobbies'); });
  socket.on("newGame", (gameType, roomName, clientCallback) => { newGame(socket, gameType, roomName, clientCallback); });
  socket.on("joinGame", (gameType, roomName, clientCallback) => { joinGame(socket, gameType, roomName, clientCallback); });
  socket.on("startGame", (gameType, roomName, clientCallback) => { startGame(socket, gameType, roomName)} );

  socket.on("getGameBoard", (roomName, clientCallback) => { getGameBoard(socket, roomName, clientCallback)} );

  socket.on("setPiece", (roomName, coord, clientCallback) => { setPiece(socket, roomName, coord, clientCallback)} );
  
  socket.on('disconnect', () => { handleDisconnect(socket); }); // this may need to be a custom event so I can control when it's called
});


/*** GENERAL FUNCTIONS ***/