const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PaymentsRequest = new Schema({
  customer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  transactionHash: {
    type: String,
  },
  status: {
    type: String,
    // Possible statuses WAITING, CANCELED, COMPLETED
  },
});

module.exports = mongoose.model('PaymentsRequest', PaymentsRequest);
