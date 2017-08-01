require('./../server/config/config');

var _ = require('lodash');
const fs = require('fs');

var bannedList = require('./../wada_prohibited_list_2017.json');
var prodList = require('./../playgroundResults.json');

// Takes a product object and an array of keys
// combines keys of arrays and returns a new array of
// unique strings with a str length greater than 3
function cleanUpStrArrays(prod, keys) {
  var newArr = [];
  keys.forEach(x => {
    if(typeof prod[x] === "string") {
      prod[x] = prod[x].split();
    }
    prod[x].forEach(y => newArr.push(y))});
  return _.uniq(newArr.toString().toLowerCase().split(/\s|\!|\&|\.|\:|\,|\(|\)|\*/).filter(y => y.length > 3));
}

// Takes an array of strings and compares to bannedList
function checkToBanList(arr) {
  var possibleIng = [],
      bannedItems = [];

  bannedList.forEach(sec => {
      if(sec.prohibited) {
      sec.prohibited.forEach(ing => {
        var lowrCase = ing.toLowerCase();
        arr.forEach(str => {
          if(lowrCase.indexOf(str) > -1 && wordExlusions.indexOf(str) <= -1) {
            possibleIng.push(str);
            bannedItems.push(ing);
            return;
          }
        })
      })
    }
  })

  possibleIng = _.uniq(possibleIng);
  bannedItems = _.uniq(bannedItems);
  wordsToBeReviewed.push.apply(wordsToBeReviewed, noDupsCont);
  wordsToBeReviewed = _.uniq(wordsToBeReviewed);
}

console.log(cleanUpStrArrays(prodList[0], ["product_content"]).length);
console.log(cleanUpStrArrays(prodList[0], ["ingredients", "facts"]).length);
