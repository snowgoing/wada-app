const mongoose = require('mongoose');

var ProductSchema = new mongoose.Schema({
  key: String,
  brand: {
    type: String,
    trim: true
  },
  name: {
    type: String,
    trim: true
  },
  img_src: String,
  img_local_path: String,
  desc_short: String,
  desc_long: String,
  product_overview: {
    type: String,
    trim: true
  },
  product_content: {
    type: [String]
  },
  content_headers: [],
  label_header: {
    label_size: String,
    label_flavor: String || null,
    label_title: String || null,
    label_serving: [{
      label: String,
      _id: false
    }]
  },
  content_body: [{
    ing: String,
    qty: String || null,
    dv: String || null,
    _id: false
  }],
  ingredients: [String],
  product_link_bodybuildingDotCom: String,
  facts: [String]
});

var Product = mongoose.model('Product', ProductSchema);

module.exports = { Product };
