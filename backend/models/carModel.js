const { Schema, model } = require('mongoose');

const carsSchema = new Schema({
    title: {
        type: String,
        required: [true, 'DB: title is required']
    },
    color: {
        type: String,
        default: 'white'
    },
    price: {
        type: Number,
        required: [true, 'DB: price is required']
    },
    engine: {
        type: String,
        default: 'gas'
    }
});

module.exports = model('cars', carsSchema);
