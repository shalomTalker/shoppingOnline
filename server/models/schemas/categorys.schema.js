const mongoose = require('mongoose');

var CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Category name is required']
    }
});

module.exports = mongoose.model("Categorys", CategorySchema);