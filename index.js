const express = require('express');
const path = require('path');
const app = express();
const env = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || 9000;

app.use(express.static(path.join(__dirname, 'build')));

const server = app.listen(PORT);

app.use(express.json({}));

require('./build_node/SocketLogic/games')(server);

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
