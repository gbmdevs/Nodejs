var express = require('express');
const { stringify } = require('qs');
var app = express();
var PORT = 3000;

var Pessoa = {
    id: 0,
    nome: '',
    idade: 0,
}

var i = 0;

app.get('/', (req,res) =>{
  var lista = [];

  for(i=0;i < 10; i++){
    Pessoa.id = i;
    Pessoa.idade = 22;
    Pessoa.nome = "Teste " + i;
    lista.push(Pessoa)
  }

  res.json(lista);
});


app.listen(PORT, () =>{
  console.log("Servidor esta rodando na porta: " + PORT);
});