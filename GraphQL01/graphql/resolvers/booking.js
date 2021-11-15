
const Booking = require('../../models/booking');

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