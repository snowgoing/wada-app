require('./../server/config/config');

const Xray = require('x-ray');
const fs = require('fs');
const download = require('download');
const { ObjectID } = require('mongodb');

var { Product } = require('./../server/models/product');
var { mongoose } = require('./../server/db/mongoose');
var removeDuplicatesBy = require('./../server/utilities/removeDuplicatesBy');
var bannedList = require('./../wada_prohibited_list_2017.json');

var xray = new Xray();

var passOrFail = (prod) => {
  var possibleIngredients = [];
  bannedList.forEach(x => {
    var inComp = x.prohibited_status.in_competition;
    var outOfComp = x.prohibited_status.out_of_competition;
    if(inComp && outOfComp && prohibited.length > 0) {
      prod.raw_data.forEach(y => {
        if(x.prohibited.indexOf(y) > -1) {
          possibleIngredients.push(y);
        }
      })
    }
  })
  return {
    pass: possibleIngredients.length > 0,
    possibleIngredients: possibleIngredients || null
  }
}

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
    return newArr.toString().toLowerCase().split(/\s|\!|\&|\.|\:|\,|\(|\)|\*/).filter(y => y.length > 1);
  };
  rawArr = isArray(rawArr);
  rawArr.forEach(x => {
    if(cleanUp.indexOf(x) <= 0) {
      cleanUp.push(x);
    }
  })
  console.log(cleanUp);
  return cleanUp;
};

var getEachProduct = (items) => {
  var allItems = [];

  for (x = 0; x < items.length; x++) {
    setTimeout((url) => {
      xray(url, '#main',
          [{
              brand: '.Product__brand',
              desc_short: '.Product__desc-short',
              desc_long: '.Product__desc-long',
              overview: '.product-content p:first-child',
              product_content: xray('.product-content'),
              content_headers: xray('.product-content', [{
                headers: ['strong']
              }]),
              name: '.Product__name',
              ingredients: '.label_ing_2',
              src: '.Product__img @src',
              facts: '.facts_label',
              label_size: '.label_size',
              label_flavor: '.label_flavor',
              label_title: '.label_title',
              label_serving: xray('.label_serving', [{
                size: 'span',
                size_two: 'span:nth-child(2)',
                size_three: 'span:nth-child(3)',
                size_four: 'span:nth-child(4)',
                size_five: 'span:nth-child(5)'
              }]),
              td: xray('.facts_label', [{
                ing: '.label_ing',
                qty: '.label_qty',
                dv: '.label_dv'
              }])

          }]
      )(function(err, prod) {
          var stringifyImgTitle = prod[0].brand + ' ' + prod[0].name;
          stringifyImgTitle = stringifyImgTitle.trim().replace(/\s+/g, '_').replace(/\%+/g, '');

          download(prod[0].src).then((data) => {
            fs.writeFileSync(`public/img/${stringifyImgTitle}.jpg`, data);
          });

        prod = prod.map(item => {
            var id = new ObjectID();
            return {
                _id: id,
                key: 'key' + id.toString(),
                brand: item.brand.trim(),
                name: function() {
                  var firstComma = item.name.indexOf(',');
                  return item.name.slice(0, firstComma).trim();
                }(),
                img_src: item.src,
                img_local_path: `img/${stringifyImgTitle}.jpg`,
                desc_short: item.desc_short,
                desc_long: item.desc_long,
                product_overview: item.overview,
                product_content: item.product_content.split('\n').map(l => l.trim()),
                content_headers: item.content_headers,
                // product_content: item.product_content.map(p => {
                //   return {
                //     header: p.header,
                //     content: p.content,
                //     bullet: p.bullet
                //   }
                // }),
                label_header: {
                  label_size: item.label_size || null,
                  label_flavor: item.label_flavor || null,
                  label_title: item.label_title || null,
                  label_serving: item.label_serving.map((w) => {
                    return {
                      label: `${w.size || ''} ${w.size_two || ''} ${w.size_three || ''} ${w.size_four || ''}${w.size_five || ''}`.trim()
                    }
                  })
                },
                content_body: item.td.map(v => {
                  return {
                    ing: v.ing.replace(/\n/g, '').trim() || null,
                    qty: v.qty || null,
                    dv: v.dv || null
                  }
                }),
                ingredients: item.ingredients.split(',').map(x => x.trim()),
                product_link_bodybuildingDotCom: href,
                facts: item.facts.replace(/\n\s+/g, ', ').trim().split(', ').splice(1)
            }
        });

        prod[0].content_body = removeDuplicatesBy(x => x.ing, prod[0].body);
        // prod[0].raw_data = createRawData(prod[0]);
        // prod[0].passOrFail = passOrFail(prod[0]);
        allItems.push.apply(allItems, prod);
        // console.log(prod);
        // fs.writeFile('./playgroundResults3.json', JSON.stringify(allItems, null, '\t'));

        var product = new Product(prod[0]);
        product.save().then(doc => {
          res.send(doc);
        }, e => {
          res.status(400).send(e);
        })

      })
    }, x * 20000, items[x]);
  }
}
var testData = [
  'https://www.bodybuilding.com/store/opt/oatsandwhey.html',
  'https://www.bodybuilding.com/store/bsn/xplode.html',
  'https://www.bodybuilding.com/store/opt/zma.html',
  'https://www.bodybuilding.com/store/bev/7keto.html'
];

getEachProduct(testData);
