/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
});

module.exports = mongoose.model('ProviderRequest', ProviderRequest);
