require('./../config/config');

const Xray = require('x-ray');
const fs = require('fs');
const Download = require('download');

var { Product } = require('./../models/product');
var { mongoose } = require('./mongoose');

var xray = new Xray();


// Get ingredient index
// var getIngredients = () => {
//   xray('https://www.bodybuilding.com/store/ajax/leftnav-ingredient-options.nav?locale=en_US&countryCode=US', 'option',
//     [{
//         ingredient: '',
//         path: '@value'
//     }]
//   )(function(err, results) {
//       fs.writeFile('./server/db/data/ingredients.json', JSON.stringify(results, null, '\t'), (err) => {
//         if (err) throw err;
//       });
//   })
// };

var populateIngredientDatabase = () => {
  var ingredients = require('./data/ingredients');

  ingredients.forEach((ingredient) => {
      var product = new Product({
        brand: ingredient.ingredient,
        name: ingredient.value,
        ingredients: ''
      })
      // console.log(product);
      product.save().then((doc) => {
        console.log(doc);
      }, e => console.log(e));
  })
};

populateIngredientDatabase();

// var getProductsByIngredient = (ingredients) => {
//   var ingredients = JSON.parse('./data/ingredients');
//
//   ingredients.forEach((ext) => {
//     console.log('Path: ', ext.path);
//     xray(`https://www.bodybuilding.com${ext.path}`, '.bb-prod-listing__copy',
//         [{
//             product: 'a',
//             href: 'a @href'
//         }]
//     )
//     .paginate('.lazy-loader @href')
//     (function(err, results) {
//         // fs.writeFile(`./server/db/data/${ext.ingredient}/${ext.ingredient}.json`, JSON.stringify(results, null, '\t'), (err) => {
//           if (err) throw err;
//           // console.log(JSON.stringify(results));
//           console.log('hit')
//           getEachProduct(JSON.stringify(results));
//     })
//   });
// };

// var getEachProduct = (items) => {
//   console.log('Hit');
//   items = JSON.parse(items);
//   items.forEach((item) => {
//     xray(`${item.href}`, '#main',
//         [{
//             brand: '.Product__brand',
//             name: '.Product__name',
//             ingredients: '.label_ing_2'
//         }]
//     )(function(err, products) {
//       var product = '';
//         products.forEach(product => {
//             product = new Product({
//                 brand: product.brand,
//                 name: product.name,
//                 ingredients: product.ingredients
//             });
//             product.save().then((doc) => {
//               // console.log(doc);
//             }, (e) => {
//               console.log(e);
//             })
//         });
//         // fs.appendFile('./results.json', JSON.stringify(results, null, '\t'));
//
//     })
//   })
// };
