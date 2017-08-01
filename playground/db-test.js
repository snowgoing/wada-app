require('./../server/config/config');

const { ObjectID } = require('mongodb');
var _ = require('lodash');

var { Product } = require('./../server/models/product');
var { Title } = require('./../server/models/searchTitles');
var { mongoose } = require('./../server/db/mongoose');
var models = require('./../playgroundResults.json');

function fileToDB() {
  models.forEach(model => {
    var product = new Product(model);
    product.save().then(doc => {
      console.log('Document saved:', model.name);
    }, e => console.log('Error:', e));
  });
};


function strToArr() {
  Product.find({}).then(docs => {
    docs.forEach(doc => {
      doc.ingredients = doc.ingredients.toString().split(',').map(x => x.trim());

      var product = new Product(doc);
      product.save().then(doc => {
        console.log('Success. Ingredients String split to Array for: ', doc.name);
      })
    })
  });
}

// fileToDB();
strToArr();
