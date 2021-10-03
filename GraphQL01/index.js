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

// Bacalhau para Testes
const events = [];

app.use(bodyParser.json());

// Mutation - CREATE, DELETE,UPDATE
// Query    - READ

app.use('/graphql',
   graphqlHTTP({
      schema: buildSchema(`
        type Event { 
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        type User { 
            _id: ID!
            email: String!
            password: String
        }

        input UserInput{
             email: String!,
             password: String!
        }
      
        input EventInput{
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        type RootQuery {
              events: [Event!]!
          }

        type RootMutation {
            createEvent(eventInput: EventInput): Event
            createUser(userInput: UserInput): User
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
     `),
     rootValue: {
        events: () => {
           return Event.find()
                .then(events => {
                  return events.map(event => {
                     return { ...event._doc , _id: event.id};
                });                
            }).catch(err => {
                console.log(err);
            })
        },
        createUser: args => { 
            // Localizar caso já exista algum usuário cadastrado no sistema
            return User.findOne({ email: args.userInput.email })
            .then(user =>{
                if(user){
                    throw new Error('Usuário ja existente.');
                }
                return  bcrypt.hash(args.userInput.password, 12)
            }).then(passwordEncrypted => {
                const user = new User({
                    email: args.userInput.email,
                    password: passwordEncrypted
                });
                return user.save();
             })
             .then(result => {
                return {...result._doc , password: null, _id: result.id }
             })
             .catch(err => {
               throw err;
            });
        },
        createEvent: args => {
            const event  = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date),
                creator: '61590be7263fbf8b87aa8420'
            });

            let createdEvent;
            return event
            .save()
            .then(result => {
                createdEvent = { ...result._doc, _id: result._doc._id.toString() };
                return User.findById('61590be7263fbf8b87aa8420');
            })
            .then(user => {
                if(!user){
                    throw new Error('Usuário não encontrado.')
                }
                user.createdEvents.push(event);
                return user.save();
            })
            .then(result => {
                 return createdEvent;
            })
            .catch(err => {
                console.log(err);
                throw err;
            });
        }
     },
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
