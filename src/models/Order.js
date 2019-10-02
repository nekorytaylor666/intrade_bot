/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = require('./User').schema;


const OrderSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    categories: [{
        categoryTitle: String
    }],
    photoUrl: String,
    isActive: {
        type: Boolean,
        default: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Order', OrderSchema);