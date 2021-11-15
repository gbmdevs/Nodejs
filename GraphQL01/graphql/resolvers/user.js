const bcrypt            = require('bcryptjs');
const User = require('../../models/user');

module.exports = { createUser: args => { 
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
 }
}