const express = require('express');
const path = require('path');
const { instrument } = require('@socket.io/admin-ui');  // https://admin.socket.io/#/
const socketIO = require('socket.io');  // https://socket.io/docs/v4/server-api/
const app = express();
const PORT = process.env.PORT || 9000;

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



function ioGetAllRooms() {
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

function getActiveLobbies(socket, clientCallback) {
  let lobbies = ioGetAllRooms();

  // Get number of people in lobby for each room
  let numJoined = [];
  for (let i = 0; i < lobbies.length; i++) {
    // let room = io.sockets.adapter.rooms[lobbies[i]];
    // numJoined.push(room.length);
    let room = io.sockets.adapter.rooms.get(lobbies[i]);
    numJoined.push(room.size);
  }

  clientCallback(lobbies, numJoined);
}

function newSequenceGame(socket, newRoomName, clientCallback) {
  socket.join(newRoomName);

  io.emit('updateLobbies', 'placeholder'); // Update lobbies on everyone's screen

  clientCallback(`Success! Joined room ${newRoomName}, a game of Sequence.`);
}
io.on('connection', (socket) => {
  console.log(`Client ${socket.id} connected.`);
  
  socket.on("getActiveLobbies", (clientCallback) => { getActiveLobbies(socket, clientCallback); });
  socket.on("newSequenceGame", (roomName, clientCallback) => { newSequenceGame(socket, roomName, clientCallback); });
  
  socket.on('disconnect', () => console.log(`Client ${socket.id} disconnected.`));
});

function shuffle1DArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
}


/*** Game Classes ***/
class Sequence {
  constructor() {
    this.deck = ['black_joker','6_diamonds','7_diamonds','8_diamonds','9_diamonds','10_diamonds','Q_diamonds','K_diamonds','A_diamonds','black_joker',
                  '5_diamonds','3_hearts','2_hearts','2_spades','3_spades','4_spades','5_spades','6_spades','7_spades','A_clubs',
                  '4_diamonds','4_hearts','K_diamonds','A_diamonds','A_clubs','K_clubs','Q_clubs','10_clubs','8_spades','K_clubs',
                  '3_diamonds','5_hearts','Q_diamonds','Q_hearts','10_hearts','9_hearts','8_hearts','9_clubs','9_spades','Q_clubs',
                  '2_diamonds','6_hearts','10_diamonds','K_hearts','3_hearts','2_hearts','7_hearts','8_clubs','10_spades','10_clubs',
                  'A_spades','7_hearts','9_diamonds','A_hearts','4_hearts','5_hearts','6_hearts','7_clubs','Q_spades','9_clubs',
                  'K_spades','8_hearts','8_diamonds','2_clubs','3_clubs','4_clubs','5_clubs','6_clubs','K_spades','8_clubs',
                  'Q_spades','9_hearts','7_diamonds','6_diamonds','5_diamonds','4_diamonds','3_diamonds','2_diamonds','A_spades','7_clubs',
                  '10_spades','10_hearts','Q_hearts','K_hearts','A_hearts','2_clubs','3_clubs','4_clubs','5_clubs','6_clubs',
                  'black_joker','9_spades','8_spades','7_spades','6_spades','5_spades','4_spades','3_spades','2_spades','black_joker',
                  'J_twoEyed', 'J_twoEyed', 'J_twoEyed', 'J_twoEyed', 'J_oneEyed', 'J_oneEyed', 'J_oneEyed', 'J_oneEyed'];
            
    this.board = [ // Blue Layout
      ['black_joker','6_diamonds','7_diamonds','8_diamonds','9_diamonds','10_diamonds','Q_diamonds','K_diamonds','A_diamonds','black_joker'],
      ['5_diamonds','3_hearts','2_hearts','2_spades','3_spades','4_spades','5_spades','6_spades','7_spades','A_clubs'],
      ['4_diamonds','4_hearts','K_diamonds','A_diamonds','A_clubs','K_clubs','Q_clubs','10_clubs','8_spades','K_clubs'],
      ['3_diamonds','5_hearts','Q_diamonds','Q_hearts','10_hearts','9_hearts','8_hearts','9_clubs','9_spades','Q_clubs'],
      ['2_diamonds','6_hearts','10_diamonds','K_hearts','3_hearts','2_hearts','7_hearts','8_clubs','10_spades','10_clubs'],
      ['A_spades','7_hearts','9_diamonds','A_hearts','4_hearts','5_hearts','6_hearts','7_clubs','Q_spades','9_clubs'],
      ['K_spades','8_hearts','8_diamonds','2_clubs','3_clubs','4_clubs','5_clubs','6_clubs','K_spades','8_clubs'],
      ['Q_spades','9_hearts','7_diamonds','6_diamonds','5_diamonds','4_diamonds','3_diamonds','2_diamonds','A_spades','7_clubs'],
      ['10_spades','10_hearts','Q_hearts','K_hearts','A_hearts','2_clubs','3_clubs','4_clubs','5_clubs','6_clubs'],
      ['black_joker','9_spades','8_spades','7_spades','6_spades','5_spades','4_spades','3_spades','2_spades','black_joker']
    ];

    this.resetGame();
  }

  resetGame() {
    this.deck = ['black_joker','6_diamonds','7_diamonds','8_diamonds','9_diamonds','10_diamonds','Q_diamonds','K_diamonds','A_diamonds','black_joker',
                  '5_diamonds','3_hearts','2_hearts','2_spades','3_spades','4_spades','5_spades','6_spades','7_spades','A_clubs',
                  '4_diamonds','4_hearts','K_diamonds','A_diamonds','A_clubs','K_clubs','Q_clubs','10_clubs','8_spades','K_clubs',
                  '3_diamonds','5_hearts','Q_diamonds','Q_hearts','10_hearts','9_hearts','8_hearts','9_clubs','9_spades','Q_clubs',
                  '2_diamonds','6_hearts','10_diamonds','K_hearts','3_hearts','2_hearts','7_hearts','8_clubs','10_spades','10_clubs',
                  'A_spades','7_hearts','9_diamonds','A_hearts','4_hearts','5_hearts','6_hearts','7_clubs','Q_spades','9_clubs',
                  'K_spades','8_hearts','8_diamonds','2_clubs','3_clubs','4_clubs','5_clubs','6_clubs','K_spades','8_clubs',
                  'Q_spades','9_hearts','7_diamonds','6_diamonds','5_diamonds','4_diamonds','3_diamonds','2_diamonds','A_spades','7_clubs',
                  '10_spades','10_hearts','Q_hearts','K_hearts','A_hearts','2_clubs','3_clubs','4_clubs','5_clubs','6_clubs',
                  'black_joker','9_spades','8_spades','7_spades','6_spades','5_spades','4_spades','3_spades','2_spades','black_joker',
                  'J_twoEyed', 'J_twoEyed', 'J_twoEyed', 'J_twoEyed', 'J_oneEyed', 'J_oneEyed', 'J_oneEyed', 'J_oneEyed'];
    
    shuffle1DArray(deck);
  }

}