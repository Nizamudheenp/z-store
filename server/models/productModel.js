const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  image: { type: String }, 
  tags: [{ type: String }],
},
{ timestamps: true });

module.exports = mongoose.model('Product', productSchema);
