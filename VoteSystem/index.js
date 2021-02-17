/* Servidor de Vote System Estudos */
const express = require("express");
const app     = express();
const http    = require('http').Server(app);
const io      = require('socket.io')(http); 

const PORT = 3000;

app.use(express.static(__dirname + '/node_modules'));  

app.get('/', (req,res) => {
   res.sendFile(__dirname+'/index.html');
});

io.on('connection', (socket) => {
  console.log('Um usuario conectou!');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta http://localhost:${PORT}`);
});




