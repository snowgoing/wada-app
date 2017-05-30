require('./server/config/config');

const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('hbs');

var app = express();
var PORT = process.env.PORT || 3000;

var model = require('./playgroundResults2.json')[0];

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: 'Check My WADA',
    model: model
  })
});

app.listen(PORT, () => {
  console.log(`Server up on port ${PORT}`);
});
