const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  companyName: {
    type: String,
    required: false,
  },
  phoneNumber: String,
  telegramUserId: String,
  isPremium: {
    type: Boolean,
    default: false,
  },
  balance: {
    type: Number,
    default: 0,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  telegramUsername: String,
});

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
