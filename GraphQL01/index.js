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
      schema: buildSchema(`
        type Event { 
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
            creator: User!
        }

        type User { 
            _id: ID!
            email: String!
            password: String
            createdEvents: [Event!]
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
                     return { 
                         ...event._doc ,
                          _id: event.id,
                          //Estudar isso
                          creator: user.bind(this, event._doc.creator)
                        };
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
                creator: '615a45036d291f3ce63538a6'
            });

            let createdEvent;
            return event
            .save()
            .then(result => {
                createdEvent = { ...result._doc, _id: result._doc._id.toString() };
                return User.findById('615a45036d291f3ce63538a6');
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
