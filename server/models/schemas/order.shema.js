const mongoose = require('mongoose');

var OrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    orderCreate: {
        type: String,
        default: new Date().toLocaleString()
    },
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Products'
        },
        amount: {
            type: Number
        }
    }],
    totalPrice: {
        type: Number,
        default: 0
    },
    address: {
        type: Array,
        required: [true, 'Address is required'], 
    },
    shippingDate: {
        type: Array,
        required: [true, 'Shipping date is required'], 
    },
    payment: {
        creditCard: String
    } 

});

module.exports = mongoose.model("Orders", OrderSchema);