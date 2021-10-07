const express           = require("express");
const bodyParser        = require("body-parser");
const { graphqlHTTP } = require('express-graphql');
const { buildSchema}    = require("graphql");
const bcrypt            = require('bcryptjs');
const app               = express();
const mongoose          = require('mongoose');

// Modelos
const Event             = require('./models/event.js');
const User              = require('./models/user.js');

// Schema e Resolvers do GraphQL
const graphQlSchema     = require('./graphql/schema/index.js');
const graphQlResolvers  = require('./graphql/resolvers/index.js');


const events = eventsIds => {
    return Event.find({_id: {$in: eventsIds}})
      .then(events => {
          return events.map(event => { 
              return { ...event._doc, _id: event.id , creator: user.bind(this, event.creator)};
          });
      })
      .catch(err =>{
          throw err
      })
}

const user = userId => {
    return User.findById(userId)
        .then(user => {
            return {...user._doc, _id: user.id};
        })
        .catch(err =>{
            throw err
        })
}

app.use(bodyParser.json());

// Mutation - CREATE, DELETE,UPDATE
// Query    - READ

app.use('/graphql',
   graphqlHTTP({
     schema: graphQlSchema,
     rootValue: graphQlResolvers,
     graphiql: true    
  })
);

// Conectar ao banco de dados
mongoose.connect('mongodb://mongodb:27017/events-react-dev', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() =>{
    app.listen(3000);
}).catch(err => {
    console.log(err);
});




/*

Criar um Registro de Exemplo

mutation{createEvent(eventInput: {
     title: "Harry potter",
     description: "Um livro muito bom para ler.",
     price: 85.99,
     date: "2021-10-01T15:32:47.435Z"
}){
  title,
  description
}
}


*/
