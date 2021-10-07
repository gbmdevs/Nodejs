const bcrypt = require('bcryptjs');

// Modelos de Tabelas
const Event   = require('../../models/event');
const User    = require('../../models/user');
const Booking = require('../../models/booking'); 

// Retirar Depois
const bacalhau = '615f78a746302f4cab2e7379'

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
    bookings: async () => {
        try{
           const bookings = await Booking.find();
           return bookings.map(booking => {
               return {...booking._doc, 
                      _id: booking.id,
                      createdAt: new Date(booking._doc.createdAt).toISOString(),
                      updatedAt: new Date(booking._doc.updatedAt).toISOString()
               }
           })
        }catch(err) {
            throw err;
        }
    }, 
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
    },
    bookEvent: async args => {        
        const fetchedEvent = await Event.findOne({ _id: args.eventId });
        // Criar nova marcação de Book
        const booking = new Booking({
             user: bacalhau,
             event: fetchedEvent
        });

        const result = await booking.save();

        return {
            ...result._doc,
            _id: result.id,
            createdAt: new Date(result._doc.createdAt).toISOString(),
            updatedAt: new Date(result._doc.updatedAt).toISOString()
        };
    }

 }