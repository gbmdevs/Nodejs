var express = require('express');
const { stringify } = require('qs');
var app = express();
var PORT = 3000;

function Pessoa(id, nome, idade){
    this.id = id;
    this.nome = nome;
    this.idade = idade
}


app.get('/', (req,res) =>{
  var lista = [];
  
  for(i = 0; i < 5; i++){ 
    let idadeTemp = Math.trunc(Math.random() * (80 - 20) + 20); 
    lista.push(new Pessoa(i, "Teste " + i, idadeTemp)); 
    
  }
  
  console.table(lista);
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(lista));
});


app.listen(PORT, () =>{
  console.log("Servidor esta rodando na porta: " + PORT);
});