const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    coinName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Coin',
        required: true,
    },
    type: {
        type: String,
        enum: ['buy', 'sell'],
        required: true,
    },
    amountInUsd: {
        type: Number,
        required: true
    },
    equivalentAmountNGN: {
        type: Number,
        required: true,
    },
    address: {
        type: String,
        required: true
    },
    rate: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['closed', 'pending', 'paid', 'approved']
    },
    bankName: {
        type: String,
        required: true
    },
    accountName: {
        type: String,
        required: true,
    },
    accountNumber: {
        type: Number,
        required:true
    },
    accountType: {
        type: String,
        enum: ['savings', 'current']
    }
}, {timestamps: true})

const Order = mongoose.model('Order', orderSchema)
module.exports = Order