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

    /* Min and Max Players */
    modifiedActiveGames[key]['minPlayers'] = activeGames[key]['game'].minPlayers;
    modifiedActiveGames[key]['maxPlayers'] = activeGames[key]['game'].maxPlayers;

    /* joined flag */
    let joined = false;
    if (socketRooms.includes(key)) { joined = true; }
    modifiedActiveGames[key]['joined'] = joined;
  }

  /* Send back to client */
  clientCallback(modifiedActiveGames);
}

function newGame(socket, gameType, newRoomName, teamName, clientCallback) {
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

  /* Push socket team to game */
  activeGames[newRoomName]['game'].teams.push(teamName);

  /* Update lobbies on everyone's screen */
  io.emit('updateLobbies');

  clientCallback(newRoomName);
}

function joinGame(socket, roomName, teamName, clientCallback) {
  /* Join lobby */
  if (Object.hasOwn(activeGames, roomName) || Object.hasOwn(abandonedGames, roomName)) {
    /* Leave current lobby if already in one */
    getSocketRooms(socket).forEach( function(room) {
      socket.leave(room);

      /* Remove team from game when leaving */
      let indexOfTeam = activeGames[room]['game'].teams.findIndex( (el) => el === teamName);
      activeGames[room]['game'].teams.splice(indexOfTeam, 1);
    });
    updateGameArray();

    /* Join lobby */
    socket.join(roomName);

    /* Brings back expired game if on recently abandoned */
    moveGameToActive(roomName);

    /* Push socket team to game */
    activeGames[roomName]['game'].teams.push(teamName);
    
    /* Update lobbies on everyone's screen */
    io.emit('updateLobbies');
    
    clientCallback(roomName);
  } else {
    /* Return undefined if join unsucecssful */
    clientCallback(undefined);
  }
}

function leaveGame(socket, roomName, teamName, clientCallback) {
  /* Leave game */
  socket.leave(roomName);

  /* Remove team from game when leaving */
  let indexOfTeam = activeGames[roomName]['game'].teams.findIndex( (el) => el === teamName);
  activeGames[roomName]['game'].teams.splice(indexOfTeam, 1);

  /* Delete from active games */
  let room = io.sockets.adapter.rooms.get(roomName);
  if (room === undefined) {
    delete activeGames[roomName];
  }

  clientCallback(roomName);
}

function startGame(socket, gameType, roomName) {
  activeGames[roomName]['game'].isStarted = true;
  activeGames[roomName]['game'].startGame();
  io.to(roomName).emit('startingGame', gameType);
}

function handleDisconnect(socket) {
  updateGameArray();
  io.emit('updateLobbies');

  console.log(`Client ${socket.id} disconnected.`)
}

function getGameBoard(socket, roomName, clientCallback) {
  let gameboard = activeGames?.[roomName]?.['game']?.board;
  let winner = activeGames[roomName]['game'].checkWin();

  clientCallback(gameboard, winner);
}

function setPiece(socket, roomName, teamName, coord, clientCallback) {
  // if checks for turn and valid placement are OK
  activeGames[roomName]['game'].setPiece(teamName, coord);

  io.emit('updateGameboard');
}

/*** SocketIO Logic ***/
io.on('connection', (socket) => {
  console.log(`Client ${socket.id} connected.`);
  
  socket.on("getActiveLobbies", (clientCallback) => { getActiveLobbies(socket, clientCallback); });
  socket.on("updateLobbies", (clientCallback) => { io.emit('updateLobbies'); });
  socket.on("newGame", (gameType, roomName, teamName, clientCallback) => { newGame(socket, gameType, roomName, teamName, clientCallback); });
  socket.on("joinGame", (roomName, teamName, clientCallback) => { joinGame(socket, roomName, teamName, clientCallback); });
  socket.on("leaveGame", (roomName, teamName, clientCallback) => { leaveGame(socket, roomName, teamName, clientCallback); });
  socket.on("startGame", (gameType, roomName, clientCallback) => { startGame(socket, gameType, roomName)} );

  socket.on("getGameBoard", (roomName, clientCallback) => { getGameBoard(socket, roomName, clientCallback)} );

  socket.on("setPiece", (roomName, teamName, coord, clientCallback) => { setPiece(socket, roomName, teamName, coord, clientCallback)} );
  
  socket.on('disconnect', () => { handleDisconnect(socket); }); // this may need to be a custom event so I can control when it's called
});


/*** GENERAL FUNCTIONS ***/