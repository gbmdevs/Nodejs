const express  = require('express');
const mongoose = require('mongoose'); 
const app      = express();
const PORT     = 3000;

mongoose.connect('mongodb://mongodb:27017/test', {useNewUrlParser: true});

app.get('/', (req,res) =>{
    res.send("E noiis!");
});

app.listen(PORT, () => {
    console.log(`Servidor rodando no http://localhost:${PORT}`); 
});