/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// phone_number,
// first_name,
// last_name,
// user_id

const UserSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    phoneNumber: String,
    telegramUserId: String,
    isPremium: {
        type: Boolean,
        default: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
});

module.exports = mongoose.model('User', UserSchema);