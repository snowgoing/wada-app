const fs = require('fs');

var list = require('./../wada_prohibited_list_2017.json');
var prods = require('./../playgroundResults.json');

// Takes an array of objects and transforms
// a string property to an array by key
var strToArray = (key, arr, delimeter) => {
  var newList = arr.map(x => {
    var prop = x[key];
    if (typeof prop === 'string' && prop.length > 0) {
      x[key] = prop.split(delimeter).map(y => y.trim());
    }
    return x;
  });
  return newList;
};

// var newList = strToArray("prohibited", list, ';');
var newList = strToArray("ingredients", prods, ',');

// var filePath = 'wada_prohibited_list_2017.json';
var filePath = 'playgroundResults.json';
fs.writeFile(filePath, JSON.stringify(newList));
