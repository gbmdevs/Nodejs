const {ApolloServer , gql} = require('apollo-server');
const express  = require('express');
const mongoose = require('mongoose'); 
const app      = express();
const PORT     = 3000;

const Schema        = mongoose.Schema;
const nomeColecao   = 'nomecerto';
const colecaoSchema = new Schema({
    chave1: {type: String} ,
    chave2: {type: Number} , 
});

mongoose.connect('mongodb://mongodb:27017/test', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const novoModelo  = mongoose.model('nomecerto', colecaoSchema, nomeColecao);
const newDocument = new novoModelo({chave1: 'Oi', chave2: 12345});
newDocument.save();

/*
app.get('/', (req,res) =>{
    res.send("E noiis!");
});
*/


/*
  Estudando GraphQL e Apollo
*/

const typeDefs = gql`
     type Query {
        hello: String
     } 
`;

const resolvers  = {
     Query: {
        hello: () => {
           return 'Hello World!a';
        }
     }
};

const server = new ApolloServer({typeDefs,resolvers});


server.listen(PORT).then(({ url }) => {
    console.log(`Servidor respondendo a  ${url}`);
});

/*
app.listen(PORT, () => {
    console.log(`Servidor rodando no http://localhost:${PORT}`); 
});
*/