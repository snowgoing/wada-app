require('./../server/config/config');

var list = require('./../wada_prohibited_list_2017.json');
var { mongoose } = require('./../server/db/mongoose');
var { WadaClass } = require('./../server/models/wada_list');

list.forEach(x => {
  var wadaClass = new WadaClass({
    class: x.class,
    title: x.title,
    content: x.content,
    prohibited_status: x['prohibited-status'],
    prohibited: x.prohibited,
    sports: x.sports
  });

  wadaClass.save().then(doc => {
    console.log('Document saved successfully! \n', doc);
  }, e => {
    console.log('Error: \n', e);
  });
});
