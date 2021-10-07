const bcrypt = require('bcryptjs');

// Modelos
const Event = require('../../models/event');
const User = require('../../models/user');

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


module.exports = {
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
            creator: '615f15f61697fc5aa3c78a60'
        });

        let createdEvent;
        return event
        .save()
        .then(result => {
            createdEvent = { ...result._doc, _id: result._doc._id.toString() };
            return User.findById('615f15f61697fc5aa3c78a60');
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