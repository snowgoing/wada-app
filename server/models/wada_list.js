const mongoose = require('mongoose');

var WadaClassSchema = new mongoose.Schema({
  class: {
    type: String,
    trim: true
  },
  title: {
    type: String,
    trim: true
  },
  content: {
    type: String,
    trim: true
  },
  prohibited_status: Object,
  prohibited: {
    type: Array,
    default: null
  },
  sports: {
    type: Object,
    default: null
  }
});

var WadaClass = mongoose.model('WadaClass', WadaClassSchema);

module.exports = { WadaClass };
