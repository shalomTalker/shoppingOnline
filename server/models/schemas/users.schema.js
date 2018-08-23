const mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({    
    email: {
        type: String,
        required: [true,'Email is required'], 
        trim: true
    },
    hash: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: [true,'First name is required'], 
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'], 
        trim: true
    },
    street: {
        type: String,
        required: [true, 'street is required'], 
        trim: true
    },
    city: {
        type: String,
        required: [true, 'city is required'], 
        trim: true
    },
    role: {
        type: Number,
        required: true
    },
    orders: [{
        orderID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Orders'
        },
        date: {
            type: String
        }
    }]
});

module.exports = mongoose.model("Users",UserSchema);