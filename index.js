const express = require('express');
const path = require('path');
const app = express();
const ENV = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || 9000;

app.use(express.static(path.join(__dirname, 'build')));

const server = app.listen(PORT);

app.use(express.json({}));

const serverImportString = (ENV !== 'development') ? './build_node/SocketLogic/games' : './server/SocketLogic/games';
require(serverImportString)(server);

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
