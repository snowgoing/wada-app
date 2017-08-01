require('./../server/config/config');

var _ = require('lodash');
const fs = require('fs');

var bannedList = require('./../wada_prohibited_list_2017.json');
var prodList = require('./../playgroundResults.json');
var wordsToBeReviewed = [];
var wordExlusions = require('./../wordExlusions.json').wordsToExclude;

var createRawData = (prod) => {
  var rawArr = [];
  var cleanUp = [];
  rawArr.push.apply(rawArr, [prod.product_content, prod.ingredients, prod.facts]);

  var isArray = (arr) => {
    var newArr = [];
    arr.forEach(x => {
      if(Array.isArray(x)) {
        newArr.push.apply(newArr, x);
      }
    })
    return newArr.toString().toLowerCase().split(/\s|\!|\&|\.|\:|\,|\(|\)|\*/).filter(y => y.length > 3);
  };
  rawArr = isArray(rawArr);
  rawArr.forEach(x => {
    if(cleanUp.indexOf(x) <= 0) {
      cleanUp.push(x);
    }
  })
  // console.log(cleanUp);
  return cleanUp;
};

var checkProduct = (prod) => {
  var allContent = createRawData(prod);
  var possibleIng = [],
      bannedItems = [];

  bannedList.forEach(sec => {
    if(sec.prohibited) {
      sec.prohibited.forEach(ing => {
        var lowrCase = ing.toLowerCase();
        allContent.forEach(str => {
          if(lowrCase.indexOf(str) > -1 && wordExlusions.indexOf(str) <= -1) {
            possibleIng.push(str);
            bannedItems.push(ing);
            return;
          }
        })
      })
    }
  })
  var noDupsCont = _.uniq(possibleIng);
  var noDupsBan = _.uniq(bannedItems);
  wordsToBeReviewed.push.apply(wordsToBeReviewed, noDupsCont);
  var noDups = _.uniq(wordsToBeReviewed);

  // fs.writeFile('./wordExlusions.json', JSON.stringify({wordsToExclude: noDups}, null, '\t'));


  console.log(`${prod.name}: ${noDupsCont}`);
  console.log(`${prod.name}: ${noDupsBan}`);
  // console.log('Words:', noDups);

};

// checkProduct(prodList[0]);
// checkProduct(prodList[3]);

prodList.forEach(x => {
  checkProduct(x);
  console.log('\n');
})
