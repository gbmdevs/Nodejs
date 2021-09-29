const express           = require("express");
const bodyParser        = require("body-parser");
const { graphqlHTTP } = require('express-graphql');
const { buildSchema}    = require("graphql");
const app               = express();
const mongoose          = require('mongoose');

const Event             = require('./models/event.js');

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
        createEvent: args => {
            //const event = {
            //    _id: Math.random().toString(),
            //    title: args.eventInput.title,
            //     description: args.eventInput.description,
            //    price: +args.eventInput.price,
            //     date: new Date().toISOString()
            //}
            const event  = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date)
            })
            return event.save().then(result => {
                console.log(result);
                return result;
            }).catch(err => {
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


