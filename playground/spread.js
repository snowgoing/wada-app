// var arr = [1, 2, 2, 3, 4, 65, 2, 34, 1 ,3];
// console.log(arr);
//
// var newArr = [...new Set(arr)];
// console.log(newArr);
//
var products = require('./../server/db/data/productLinks');
console.log(products.length);

// var newProducts = [...new Set(products)];
// console.log(newProducts.length);
//
var obj = [
  {
    name: 'Mark',
    age: 25
  },
  {
    name: 'Matt',
    age: 64
  },
  {
    name: 'Lenny',
    age: 45
  },
  {
    name: 'Jen',
    age: 23
  },
  {
    name: 'Mark',
    age: 25
  }
];
//
// console.log(obj.length);
//
// var newObj = [...new Set(obj)];
// console.log(newObj.length);

var filteredArr = [];
var filterArr = function(){
  var args = Array.from(arguments);

  filteredArr = args.filter((obj) => {
    if(filteredArr.indexOf(obj < 0)) {
      return obj;
    }
  })
  return filteredArr;
};

// var great = filterArr(obj);
// console.log(great);

function removeDuplicatesBy(keyFn, array) {
  var mySet = new Set();
  return array.filter(function(x) {
    var key = keyFn(x), isNew = !mySet.has(key);
    if (isNew) mySet.add(key);
    return isNew;
  });
}

var test = removeDuplicatesBy(x => x.href, products);
console.log(test);
