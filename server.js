require('./server/config/config');

const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('hbs');
var logger = require("morgan");
var nodemailer = require('nodemailer');
var mg = require('nodemailer-mailgun-transport');
var nconf = require('nconf');

// var auth =  require('./config.json');
var app = express();
var PORT = process.env.PORT || 3000;

var model = require('./playgroundResults.json')[0];
var models = require('./playgroundResults.json');
// var { mongoose } = require('./server/db/mongoose');
// var { WadaClass } = require('./server/models/wada_list');

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(__dirname + '/public'));


hbs.registerHelper('checkIngredientTitle', () => {
  var ingredientLabel = model.facts.filter(str => {
    if (str === 'Other Ingredients:') {
      return str
    }
  })
  return ingredientLabel[0] || 'Ingredients:';
});

hbs.registerHelper('checkIndent', (obj) => {
  var phrasesToIndent = ['Calories From Fat', 'Saturated Fat', 'Trans Fat', 'Dietary Fiber', 'Sugars'];
  if(phrasesToIndent.indexOf(obj.ing) > -1){
    return  new hbs.SafeString('<p> &nbsp; &nbsp </p>');
  }
});

hbs.registerHelper('gotoPage', (x) => {
  console.log(x);
})

var renderObj = {
  pageTitle: 'Check My WADA',
  model: models,
  searchTerm: 'stuff'
};

app.get('/', (req, res) => {
  res.render('homepage.hbs');
});

app.get('/product', (req, res) => {
  res.render('singleProductPage.hbs', renderObj);
});

app.get('/products', (req, res) => {
  res.render('manyProductPage.hbs', renderObj);
});

app.get('/contact', (req, res) => {
  res.render('contactUs.hbs');
});

app.post('/contact', (req, res) => {
  console.log('Form submitted', req.body);
  res.render('contactUs.hbs');
});

app.get('/product_titles', (req, res) => {
  res.send(models).status(200);
});

// app.get('/wada_api', (req, res) => {
//   WadaClass.find({}).then(docs => {
//     res.send(docs).status(200);
//   }, e => res.status(400).send(e));
// });

app.get('/test', (req, res) => {
  var searchStr = req.query.searchTerm;
  renderObj.searchTerm = req.query.searchTerm;

  if(searchStr.length > 0) {
    var list = models.filter((supp) => {
      var name = supp.name.toLowerCase();
      var brand = supp.brand.toLowerCase();
      return name.indexOf(searchStr) > -1 || brand.indexOf(searchStr) > -1;
    });

    renderObj.model = list;

    res.send(list);
  } else {
    res.send({error: true});
  }
});

app.get('/test/:id', (req, res) => {
  var list = models.filter(supp => supp.key === req.params.id);
  renderObj.model = list;
  res.send(list);
});

app.listen(PORT, () => {
  console.log(`Server up on port ${PORT}`);
});
