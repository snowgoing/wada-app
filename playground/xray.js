require('./../server/config/config');

const Xray = require('x-ray');
const fs = require('fs');
const download = require('download');

var { Product } = require('./../server/models/product');
var { mongoose } = require('./../server/db/mongoose');
var removeDuplicatesBy = require('./../server/utilities/removeDuplicatesBy');

var xray = new Xray();

var getEachProduct = (href) => {
  xray(href, '#main',
      [{
          brand: '.Product__brand',
          desc_short: '.Product__desc-short',
          desc_long: '.Product__desc-long',
          product_content: '.product-content p:first-child',
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
  )(function(err, product) {
      var stringifyImgTitle = product[0].brand + ' ' + product[0].name;
      stringifyImgTitle = stringifyImgTitle.trim().replace(/\s+/g, '_');

      download(product[0].src).then((data) => {
        fs.writeFileSync(`public/img/${stringifyImgTitle}.jpg`, data);
      });

    product = product.map(item => {
        return {
            brand: item.brand.trim(),
            name: item.name.trim(),
            img_src: item.src,
            img_local_path: `img/${stringifyImgTitle}.jpg`,
            desc_short: item.desc_short,
            desc_long: item.desc_long,
            product_content: item.product_content.replace(/\n/g, '').trim(),
            header: {
              label_size: item.label_size || null,
              label_flavor: item.label_flavor || null,
              label_title: item.label_title || null,
              label_serving: item.label_serving.map((w) => {
                return {
                  label: `${w.size || ''} ${w.size_two || ''} ${w.size_three || ''} ${w.size_four || ''}${w.size_five || ''}`.trim()
                }
              })
            },
            body: item.td.map(v => {
              return {
                ing: v.ing.replace(/\n/g, '').trim() || null,
                qty: v.qty || null,
                dv: v.dv || null
              }
            }),
            ingredients: item.ingredients,
            product_link_bodybuildingDotCom: href,
            facts: item.facts.replace(/\n\s+/g, ', ').trim().split(', ').splice(1)
        }
    });
    product[0].body = removeDuplicatesBy(x => x.ing, product[0].body);
    // console.log(product);
    fs.writeFile('./playgroundResults2.json', JSON.stringify(product, null, '\t'));
  })
}

// getEachProduct('https://www.bodybuilding.com/store/opt/oatsandwhey.html?searchTerm=optimum%20nutrition%20whey%20oat');
// getEachProduct('https://www.bodybuilding.com/store/opt/oatsandwhey.html');
// getEachProduct('https://www.bodybuilding.com/store/bsn/xplode.html');
// getEachProduct('https://www.bodybuilding.com/store/opt/zma.html');
getEachProduct('https://www.bodybuilding.com/store/bev/7keto.html');
