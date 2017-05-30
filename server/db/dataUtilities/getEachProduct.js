require('./../../config/config');

const Xray = require('x-ray');
const fs = require('fs');
const download = require('download');

var { Product } = require('./../../models/product');
var { mongoose } = require('./../mongoose');

var xray = new Xray();

// var getEachProduct = (items) => {
//   console.log('Hit');
//   items = JSON.parse(items);
//   items.forEach((item) => {
//     xray(`${item.href}`, '#main',
//         [{
//             brand: '.Product__brand',
//             name: '.Product__name',
//             ingredients: '.label_ing_2'
//         }]
//     )(function(err, products) {
//
//     })
//   })
// };

var getEachProduct = () => {
  xray('https://www.bodybuilding.com/store/opt/zma.html', '#main',
      [{
          brand: '.Product__brand',
          name: '.Product__name',
          ingredients: '.label_ing_2',
          src: '.Product__img @src',
          facts: '.facts_label'
      }]
  )(function(err, product) {
    product = product.map(item => {
        return {
            brand: item.brand.trim(),
            name: item.name.trim(),
            ingredients: item.ingredients.split(', '),
            src: item.src,
            facts: item.facts.replace(/\n\s+/g, ', ').trim().split(', ').splice(1)
        }
    });
    console.log(product);
    // download.dest('./images');
    // download.run();
    fs.writeFile('./results.json', JSON.stringify(product, null, '\t'));
  })
}

getEachProduct();

var getImage = () => {
  xray('https://www.bodybuilding.com/store/opt/zma.html', '#main',
      [{
        brand: '.Product__brand',
        name: '.Product__name',
        ingredients: '.label_ing_2',
        src: '.Product__img @src'
        tbody: 'tbody:first-child',
        label_size: '.label_size',
        label_flavor: '.label_flavor',
        label_title: '.label_title',
        label_serving: '.label_serving',
        label_heading_l: '.label_heading_l',
        label_heading_r: '.label_heading_r'.
        label_ing: '.label_ing',
        label_qty: '.label_qty',
        label_dv: '.label_dv'

      }]
  )(function(err, product) {
    product = product.map(item => {
      return {
        // tbody: item.tbody.replace(/\n\s+\n\s+\n\s+/g, ', ').trim().split(', '),
        header: {
          label_size: item.label_size,
          label_flavor: item.label_flavor || null,
          label_title: item.label_title || null,
          label_serving: item.label_serving
        },
        // labelHeader: {
        //   label_heading_l: item.label_heading_l,
        //   label_heading_r: item.label_heading_r
        // },
        label_ing: [
          {
            ing: item.label_ing,
            qty: item.label_qty,
            dv: item.label_dv
          }
        ]
      }
    })
    console.log(product);
//     download(product[0].src, 'img').then(() => {
//     console.log('done!');
// });
    fs.writeFile('./testResults.json', JSON.stringify(product, null, '\t'));
  })
}

// getImage();
