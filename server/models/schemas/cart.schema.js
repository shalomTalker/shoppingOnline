const mongoose = require('mongoose');

var CartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    timeStamp: {
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
    }
});

module.exports = mongoose.model("Carts", CartSchema);