const mongoose = require('mongoose');

console.log('Mongo', process.env.MONGODB_URI);
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, {
  useMongoClient: true});

module.exports = { mongoose };
