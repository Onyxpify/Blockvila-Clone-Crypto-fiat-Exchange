const mongoose = require('mongoose');

const coinSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Coin name is required']
    },
    symbol: {
        type: String,
        required: [true, 'Coin Symbol is required']
    },
    logo: {
        type: String,
        required: [false]
    },
    buy: {
        type: Number,
        default: 0,
        min: [20, 'Buy price should be greater than 20 USD'],
        required: false,
    },
    sell: {
        type: Number,
        default: 0,
        min: [10, 'Sell price should be greater than 10 USD'],
        required: false
    }
})
const Coin = mongoose.model('Coin', coinSchema)

module.exports = Coin