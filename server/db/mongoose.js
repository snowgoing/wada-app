const mongoose = require('mongoose');

const options = {
    useMongoClient: true,
    server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
    replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }
};

console.log('Mongo', process.env.MONGODB_URI);
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, options);

module.exports = { mongoose };
