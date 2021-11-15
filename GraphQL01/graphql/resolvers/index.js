const bcrypt = require('bcryptjs');

// Resolvers das tabelas
const eventsResolver  = require('./events');
const bookingResolver = require('./booking'); 
const userResolver    = require('./user');

// Retirar Depois
const bacalhau = '6191dfe4585d8c77f892c028'

const rootResolver = {
    ...eventsResolver,
    ...bookingResolver,
    ...userResolver
}

const user = userId => {
    return User.findById(userId)
        .then(user => {
            return {...user._doc,
                    _id: user.id, 
                    createdEvents: events.bind(this, user._doc.createdEvents)};
        })
        .catch(err =>{
            throw err
        })
}

module.exports = rootResolver;
