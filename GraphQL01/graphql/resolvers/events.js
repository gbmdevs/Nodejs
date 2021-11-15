/* Resolver referente a tabela Event
   Descrição :
    _id: Id da tabela
    title: Titulo (String),
    description: Descricao(String),
    price: Preco(Double),
    date: Data(Date),
    creator: Criador(_id)
*/

const Event = require('../../models/event');


const events = eventsIds => {
    return Event.find({_id: {$in: eventsIds}})
      .then(events => {
          return events.map(event => { 
              return { ...event._doc, 
                      _id: event.id , 
                      date: new Date(event._doc.date).toISOString(),
                      creator: user.bind(this, event.creator)};
          });
      })
      .catch(err =>{
          throw err
      })
}


module.exports = {
    events: async () => {
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
    createEvent: args => {
        const event  = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: bacalhau
        });

        let createdEvent;
        return event
        .save()
        .then(result => {
            createdEvent = { ...result._doc, _id: result._doc._id.toString() };
            return User.findById(bacalhau);
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
}