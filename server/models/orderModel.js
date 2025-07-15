const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [ { product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, quantity: Number } ],
  shippingAddress: {
    fullName: String,
    address: String,
    city: String,
    postalCode: String,
    country: String,
  },
  totalAmount: Number,
  paymentIntentId: String,   
  status: { type: String, enum: ['Processing', 'Shipped', 'Delivered'], default: 'Processing' },
  createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Order', orderSchema);
