const mongoose = require('mongoose');

var ProductSchema = new mongoose.Schema({
  brand: {
    type: String,
    trim: true
  },
  name: {
    type: String,
    trim: true
  },
  ingredients: {
    type: [String]
  },
  src: {
    type: String
  },
  facts: {
    type: [String]
  }
});

var Product = mongoose.model('Product', ProductSchema);

module.exports = { Product };
