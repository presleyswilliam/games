module.exports = (server) => {
  const { instrument } = require('@socket.io/admin-ui');  // https://admin.socket.io/#/
  const socketIO = require('socket.io');  // https://socket.io/docs/v4/server-api/
  const Sequence = require('../public/GameDefinitions/Sequence');
  const TicTacToe = require('../public/GameDefinitions/TicTacToe');
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




  /*** Game Variables ***/
  // const ioGamesNamespace = io.of('/games');
  var activeGames = {}; // { lobbyName: { game: <game>, [,... otherGameInfo]} [,...{}] }
  var abandonedGames = {}; // { lobbyName: { game: <game>, [,... otherGameInfo]} [,...{}] }
  // setInterval(() => {
  //   console.log(activeGames)
  // }, 10000);



  /*** Basic SocketIO Functions ***/
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

  function getClientsInRoom(roomName) {
    let clientsInRoomSet = io.sockets.adapter.rooms.get(roomName);  // Returns a Set() data type
    let clientsInRoomArr = clientsInRoomSet === undefined ? [] : Array.from(clientsInRoomSet);
    return clientsInRoomArr;
  }

  function getSocketRooms(socket) {
    const arr = Array.from(socket.rooms);
    const filtered = arr.filter(room => room !== socket.id);
    return filtered;
  }

  function socketLeaveAllRooms(socket) {
    getSocketRooms(socket).forEach( (roomName) => { leaveGame(socket, roomName) } );
    abondonEmptyLobbies();
  }



  /*** Basic Lobby Functions ***/
  function moveGameToActive(key) {
    /* If game is not abandoned, return */
    if (!Object.hasOwn(abandonedGames, key)) { return; }

    /* Prevent game from deleting */
    clearTimeout(abandonedGames[key]['timeoutRef']);
    delete abandonedGames[key]['timeoutRef'];
    // console.log(`Cleared timeout for room: ${key}`)
    
    /* Copy game to active list */
    activeGames[key] = JSON.parse(JSON.stringify((abandonedGames[key]))); // structuredClone() not supported on Heroku nodejs --- activeGames[key] = structuredClone(abandonedGames[key]);
    activeGames[key]['game'] = abandonedGames[key]['game']; // Game object doesn't get copied properly

    /* Remove game from abandoned list */
    delete abandonedGames[key];
  }
  function moveGameToAbandoned(key) {
    /* If game is not active, return */
    if (!Object.hasOwn(activeGames, key)) { return; }

    /* Copy game to abandoned list */
    abandonedGames[key] = JSON.parse(JSON.stringify((activeGames[key]))); // structuredClone() not supported on Heroku nodejs --- abandonedGames[key] = structuredClone(activeGames[key]);
    abandonedGames[key]['game'] = activeGames[key]['game']; // Game object doesn't get copied properly

    /* Set timer to delete game for inactivity */
    abandonedGames[key]['timeoutRef'] = setTimeout(() => {
      delete abandonedGames[key];
      // console.log(`Deleted room: ${key}`)
    }, 300000);  // Time in ms --- 300000: 5min, 10000: 10sec

    /* Remove game from active list */
    delete activeGames[key];
  }

  function abondonEmptyLobbies() {
    /* Get all socketIO rooms */
    let lobbyNames = ioGetAllRoomNames();
    
    /* Remove games from active list that don't have socketIO rooms */
    for (const [key, value] of Object.entries(activeGames)) { // Iterating through activeGames[roomName] object
      if (lobbyNames.includes(key) === false) { moveGameToAbandoned(key); }
    }
  }


  function deleteRoom(roomName) {
    delete activeGames[roomName];
    delete abandonedGames[roomName];
    // console.log(`Deleted room: ${roomName}`)
  }

  function getNumJoined(roomName) {
    let room = io.sockets.adapter.rooms.get(roomName);
    numJoined = room.size;
    return numJoined;
  }

  function getActiveLobbies(socket, clientCallback) {  
    /* Get info from activeGames object */
    let modifiedActiveGames = {};
    let socketRooms = getSocketRooms(socket);
    for (const [key, value] of Object.entries(activeGames)) {
      /* Update numJoined */
      activeGames[key]['numJoined'] = getNumJoined(key);


      /* name */
      modifiedActiveGames[key] = {};

      /* gameType */
      modifiedActiveGames[key]['gameType'] = activeGames[key]['game'].gameType;

      /* isStarted */
      modifiedActiveGames[key]['isStarted'] = activeGames[key]['game'].isStarted;

      /* numJoined */
      modifiedActiveGames[key]['numJoined'] = activeGames[key]['numJoined'];

      /* teamsTally */
      modifiedActiveGames[key]['teamInfo'] = JSON.parse(JSON.stringify(activeGames[key]['game'].teamInfo));

      /* canStart */
      let canStart = activeGames[key]['game'].canStart(numJoined);
      modifiedActiveGames[key]['canStart'] = canStart;

      /* canJoin */
      let canJoin = activeGames[key]['game'].canJoin(numJoined);
      modifiedActiveGames[key]['canJoin'] = canJoin;

      /* isJoined flag */
      let isJoined = false;
      if (socketRooms.includes(key)) { isJoined = true; }
      modifiedActiveGames[key]['isJoined'] = isJoined;
    }

    /* Send back to client */
    clientCallback(modifiedActiveGames);
  }

  function newGame(socket, gameType, newRoomName, clientCallback) {
    /* Error out if game already exists */
    let err;
    let existingRooms = ioGetAllRoomNames();
    if (existingRooms.includes(newRoomName)) { err = 'A game with that name already exists.'; clientCallback(null, null, err); return; }

    /* Leave current lobbies if already in one */
    socketLeaveAllRooms(socket);

    /* Create lobby */
    socket.join(newRoomName);

    /* Create new game */
    if (gameType === 'Sequence') {
      activeGames[newRoomName] = { game: new Sequence };
    } else if (gameType === 'TicTacToe') {
      activeGames[newRoomName] = { game: new TicTacToe };
    }

    /* Assign team for callback */
    let teamName = activeGames[newRoomName]['game'].assignTeam();

    /* Add numJoined to object */
    activeGames[newRoomName]['numJoined'] = getNumJoined(newRoomName);

    /* Update lobbies on everyone's screen */
    io.emit('updateLobbies');

    clientCallback(newRoomName, teamName, err);
  }

  function joinGame(socket, roomName, teamName, clientCallback) {
    /* Error out if game doesn't exists */
    let err;
    let inActiveGamesList = Object.hasOwn(activeGames, roomName);
    let inAbandonedGamesList = Object.hasOwn(abandonedGames, roomName);
    if (!inActiveGamesList && !inAbandonedGamesList) { err = 'Unable to join game. There are no games with that name.'; clientCallback(null, null, err); return; }

    /* Leave current lobbies if already in one */
    socketLeaveAllRooms(socket);

    /* Join lobby */
    socket.join(roomName);

    /* Brings back expired game if on recently abandoned */
    moveGameToActive(roomName);

    /* Assign team for callback if not reconnecting */
    let newTeamName;
    if (teamName === null) { newTeamName = activeGames[roomName]['game'].assignTeam(); } else { newTeamName = teamName; }
    
    /* Update lobbies on everyone's screen */
    io.emit('updateLobbies');
    
    clientCallback(roomName, newTeamName, err);
  }

  function startGame(socket, roomName) {
    activeGames[roomName]['game'].isStarted = true;
    activeGames[roomName]['game'].startGame();

    let gameType = activeGames[roomName]['game'].gameType;
    io.to(roomName).emit('startingGame', gameType);
  }

  function leaveGame(socket, roomName, teamName) {
    /* Prevent server crashing on undefined game => do nothing instead */
    let game = activeGames?.[roomName]?.['game'];
    if (game === undefined) { return; }

    /* Leave game */
    socket.leave(roomName);

    /* Remove player from game's team object */
    game.leaveTeam(teamName);

    /* Delete from active games IF no clients left */
    let clientsInRoom = getClientsInRoom(roomName);
    if (clientsInRoom.length === 0) { deleteRoom(roomName); }

    io.emit('updateLobbies');
  }

  function joinTeam(socket, prevTeamName, newTeamName, clientCallback) {
    /* Error out if in more than one game */
    let err;
    let socketGames = getSocketRooms(socket);
    if (socketGames.length > 1) { err = 'Unable to join team. You have joined more than one game.'; clientCallback(null, err); return; }

    let roomName = socketGames[0];

    /* Error out if team doesn't exists */
    let teamExists = activeGames[roomName]['game'].teamNames.includes(prevTeamName);
    if (!teamExists) { err = 'Unable to join team. There are no teams with that name.'; clientCallback(null, err); return; }


    /* Leave current team if already in one */
    activeGames[roomName]['game'].leaveTeam(prevTeamName);

    /* Join team */
    activeGames[roomName]['game'].joinTeam(newTeamName);
    
    /* Update lobbies on everyone's screen */
    io.emit('updateLobbies');
    
    clientCallback(newTeamName, err);
  }



  /*** Basic Game Functions ***/
  function getGameboardLayout(socket, roomName, clientCallback) {
    /* Prevent server crashing on undefined game => do nothing instead */
    let game = activeGames?.[roomName]?.['game'];
    if (game === undefined) { return; }

    let gameboardLayout = game.boardLayout;

    clientCallback(gameboardLayout);
  }

  function getGameState(socket, params, clientCallback) {
    /* Prevent server crashing on undefined game => do nothing instead */
    let game = activeGames?.[params.roomName]?.['game'];
    if (game === undefined) { return; }

    let gameState = game.getGameState(params);

    clientCallback(gameState);
  }

  function swapHandCard(socket, roomName, teamName, handIndex) {
    /* Prevent server crashing on undefined game => do nothing instead */
    let game = activeGames?.[roomName]?.['game'];
    if (game === undefined) { return; }

    let didSwap = game.swapHandCard(teamName, handIndex);
    if (didSwap) { io.emit('updateGameboard'); }
  }

  function placePiece(socket, roomName, teamName, coord) {
    /* Prevent server crashing on undefined game => do nothing instead */
    let game = activeGames?.[roomName]?.['game'];
    if (game === undefined) { return; }

    game.placePiece(teamName, coord);

    io.emit('updateGameboard');
  }



  /*** SocketIO Logic ***/
  io.on('connection', (socket) => {
    console.log(`Client ${socket.id} connected.`);


    /*** Basic Lobby Functions ***/
    socket.on('getActiveLobbies', (clientCallback) => { getActiveLobbies(socket, clientCallback); });
    socket.on('updateLobbies', (clientCallback) => { io.emit('updateLobbies'); });
    socket.on('newGame', (gameType, roomName, clientCallback) => { newGame(socket, gameType, roomName, clientCallback); });
    socket.on('joinGame', (roomName, teamName, clientCallback) => { joinGame(socket, roomName, teamName, clientCallback); });
    socket.on('joinTeam', (prevTeamName, newTeamName, clientCallback) => { joinTeam(socket, prevTeamName, newTeamName, clientCallback); });
    socket.on('leaveGame', (roomName, teamName) => { leaveGame(socket, roomName, teamName); });
    socket.on('startGame', (roomName) => { startGame(socket, roomName)} );
    // io.emit('updateLobbies');
    // io.to(roomName).emit('startingGame', gameType);


    /*** Basic Game Functions ***/
    socket.on('getGameboardLayout', (roomName, clientCallback) => { getGameboardLayout(socket, roomName, clientCallback)} );
    socket.on('getGameState', (params, clientCallback) => { getGameState(socket, params, clientCallback)} );
    socket.on('swapHandCard', (roomName, teamName, handIndex) => { swapHandCard(socket, roomName, teamName, handIndex)} );
    socket.on('placePiece', (roomName, teamName, coord) => { placePiece(socket, roomName, teamName, coord)} );
    // io.emit('updateGameboard');


    /*** SocketIO Disconnect Logic ***/
    socket.on('disconnect', () => { handleDisconnect(socket); }); // this may need to be a custom event so I can control when it's called
  });

  function handleDisconnect(socket) {
    abondonEmptyLobbies();
    io.emit('updateLobbies');

    console.log(`Client ${socket.id} disconnected.`)
  }


  /*** GENERAL FUNCTIONS ***/
}