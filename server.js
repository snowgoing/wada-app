require('./server/config/config');

const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('hbs');
var logger = require("morgan");
var nodemailer = require('nodemailer');
var mg = require('nodemailer-mailgun-transport');
var nconf = require('nconf');
var _ = require('lodash');

// var auth =  require('./config.json');
var app = express();
var PORT = process.env.PORT || 3000;

var model = require('./playgroundResults.json')[0];
var models = require('./playgroundResults.json');
var { Product } = require('./server/models/product');
var { mongoose } = require('./server/db/mongoose');


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

hbs.registerHelper('limitContentLength', (arr) => {
  var str = arr.filter(x => x.length > 0).toString().replace(/\,/gi, " ");
  return str.length < 250 ? str + "..." : str.slice(0, 250) + "...";
})

var renderObj = {
  pageTitle: 'Check My Supplement',
  model: models,
  searchTerm: 'stuff'
};

app.get('/', (req, res) => {
  res.render('homepage.hbs');
});

app.get('/scan', (req, res) => {
  res.render('scanPage.hbs');
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
  Product.find({}).then(docs => {
    var strTitles = docs.map(y => y.name);
    docs.forEach(doc => strTitles.push(doc.brand));
    strTitles = Array.from(new Set(strTitles));
    res.send({strTitles}).status(200);
  }, (e) => res.status(400).send(e));
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

app.get('/product_search', (req, res) => {
  var text = req.query.searchText;
  var regEx = new RegExp(text, 'i');
  renderObj.searchTerm = text;

  Product.find({$or: [{brand: {$regex: regEx}}, {name: {$regex: regEx}}]}).then(docs => {
    renderObj.model = docs;
    res.send({docs}).status(200);
  }, (e) => res.status(400).send({error: true}));
});

app.get('/product_search/:id', (req, res) => {
  var key = req.params.id;

  Product.find({key}).then(doc => {
    renderObj.model = doc;
    res.send({doc}).status(200);
  }, (e) => res.status(400).send({error: true}));
});

app.get('/test/:id', (req, res) => {
  var list = models.filter(supp => supp.key === req.params.id);
  renderObj.model = list;
  res.send(list);
});

app.listen(PORT, () => {
  console.log(`Server up on port ${PORT}`);
});
