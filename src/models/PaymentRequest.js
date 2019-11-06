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
  amount: {
    type: Number,
  },
  //TODO переписать так чтоб ставило дату когда перешел в Completed
  date: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model('PaymentsRequest', PaymentsRequest);
