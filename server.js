require('./server/config/config');

const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('hbs');

var app = express();
var PORT = process.env.PORT || 3000;

var model = require('./playgroundResults2.json')[0];
var models = require('./playgroundResults2.json');

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

hbs.registerHelper('checkIngredientTitle', () => {
  var ingredientLabel = model.facts.filter(str => {
    if (str === 'Other Ingredients:') {
      return str
    }
  })
  return ingredientLabel[0] || 'Ingredients:';
});

hbs.registerHelper('autoSuggestSearch', () => {

});

hbs.registerHelper('submitSearch', () => {
  console.log('This is in the helper function');
});

var test = ['flour', 'whey', 'taurine', 'Gelatin'];

var renderObj = {
  pageTitle: 'Check My WADA',
  model: model,
  fail: false
};

app.get('/', (req, res) => {
  res.render('home.hbs', renderObj);
});

app.get('/products', (req, res) => {
  res.send(models).status(200);
});

app.post('/products', (req, res) => {
  renderObj.fail = false;
  var product = models.filter((name) => {
    return name.name === req.body.text;
  });

  var pass = product[0].facts.filter((ing) => {
    console.log(ing);
    if(test.indexOf(ing) > -1) {
      return ing;
    }
  });
  if(pass.length > 0){
    renderObj.fail = true;
  }
  console.log('Pass: ', pass);
  renderObj.model = product[0];

  res.send(product[0]).status(200);
});

app.listen(PORT, () => {
  console.log(`Server up on port ${PORT}`);
});
