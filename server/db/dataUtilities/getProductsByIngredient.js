require('./../../config/config');

const Xray = require('x-ray');
const fs = require('fs');
const Download = require('download');

var { Product } = require('./../../models/product');
var { mongoose } = require('./../mongoose');

var xray = new Xray();

function removeDuplicatesBy(keyFn, array) {
  var mySet = new Set();
  return array.filter(function(x) {
    var key = keyFn(x), isNew = !mySet.has(key);
    if (isNew) mySet.add(key);
    return isNew;
  });
}

function writeFile(array, writeFileName) {
  var writePath = `./server/db/data/data_productLinks/${writeFileName}.json`;
  fs.writeFile(writePath, JSON.stringify(array, null, '\t'), (err) => {
    if (err) throw err;
  })
}

var getProductsByIngredient = (filepath, writeFileName, cb) => {
  var ingredients = require(filepath);
  var productLinksArray = [];

  for (x = 0; x < ingredients.length; x++) {
    setTimeout((obj) => {
      xray(`https://www.bodybuilding.com${obj.value}`, '.bb-prod-listing__copy',
          [{
              product: 'a',
              href: 'a @href'
          }]
      )
      .paginate('.lazy-loader @href')
      (function(err, results) {
        console.log(results);
          productLinksArray.push.apply(productLinksArray, results);
          // Filter out duplicate data by page link
          productLinksArray = removeDuplicatesBy(x => x.href, productLinksArray);
          cb(productLinksArray, writeFileName);
      })
    }, x * 61000, ingredients[x]);
  }
};

// getProductsByIngredient('./data/ingredients_A-C', 'productLinks_A-C', writeFile);
// getProductsByIngredient('./data/ingredients_D-K', 'productLinks_D-K', writeFile);
// getProductsByIngredient('./data/ingredients_L-R', 'productLinks_L-R', writeFile);
// getProductsByIngredient('./data/ingredients_S-Z', 'productLinks_S-Z', writeFile);
