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
    type: String,
    trim: true
  }
});

var Product = mongoose.model('Product', ProductSchema);

module.exports = { Product };
