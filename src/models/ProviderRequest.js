const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProviderRequest = new Schema({
  provider: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  order: {
    type: Schema.Types.ObjectId,
    ref: 'Order',
  },
  confirmed: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model('ProviderRequest', ProviderRequest);
