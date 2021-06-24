var http = require('http');
var PORT = 3000

http.createServer( (req,res) => {
  res.end("Ola");
}).listen(3000, "172.20.0.6");
console.log("Rodando")