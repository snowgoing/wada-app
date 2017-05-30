const Xray = require('x-ray');
const fs = require('fs');

var xray = new Xray();

// Get ingredient index
var getIngredients = () => {
  xray('https://www.bodybuilding.com/store/ajax/leftnav-ingredient-options.nav?locale=en_US&countryCode=US', 'option',
    [{
        ingredient: '',
        value: '@value'
    }]
  )(function(err, results) {
    // ingredients.json is manually split into four alphabetically grouped files
      fs.writeFile('./server/db/data/ingredients.json', JSON.stringify(results, null, '\t'), (err) => {
        if (err) throw err;
      });
  })
};

// Experimenting with database. Function to be incorporated with above.
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
