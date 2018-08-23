const mongoose = require('mongoose');

var ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'], 
        trim: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categorys'
    },
    price: {
        type: Number,
        required: [true, 'Price is required'], 
        trim: true
    },
    image: {
        type: String,
        required: [true, 'Image is required']
    },
    kg: {
        type: Boolean,
        required: [true, 'kg is required']
    }
});

module.exports = mongoose.model("Products", ProductSchema);