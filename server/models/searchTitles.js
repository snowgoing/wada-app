const mongoose = require('mongoose');

var SearchTitleSchema = new mongoose.Schema({
  brand: [String],
  title: [String],
  ingredients: [String]
});

var Title = mongoose.model('Title', SearchTitleSchema);

module.exports = { Title };
