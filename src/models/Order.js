/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = require('./User').schema;

const OrderSchema = new Schema({
  description: {
    type: String,
    required: true,
  },
  //TODO Сделать популэйт на файл заказа и сделать из этого массив
  docType: {
    type: String,
  },
  fileId: {
    type: String,
  },
  cities: [
    {
      type: String,
    },
  ],
  categories: [
    {
      categoryTitle: String,
    },
  ],
  photoUrl: String,
  isActive: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  customer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

module.exports = mongoose.model('Order', OrderSchema);
