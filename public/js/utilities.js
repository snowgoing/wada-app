$(document).ready(function(){


  $("#searchText").on('focus', function(){
    var el = $('#searchText'),
        val = el.val(),
        url = '/product_titles',
        arr = [];

    console.log(val);

    $.get(url, function(data){
      if (data) {
        arr = data.map(function(prod) {
          return prod.name;
        });
        $('#searchText').autocomplete({
          source: arr
        });
      }
      console.log('Data retrieved from Server: ', arr);
    });
    // var items = arr.filter(function(name){
    //   return name.indexOf(val) > -1;
    // })
  });

  $('#searchText').on('keypress', function(e){
    var text = $('#searchText').val().toLowerCase().trim();
    if(e.which == 13 && text.length > 0){
      $.ajax({
        url: '/test',
        type: 'GET',
        data: {searchTerm: text},
        success: function(data) {
          if(data.error || data.length === 0) {
            alert('Product not found');
          } else if (data.length === 1) {
              window.location.href = "/product";
          } else {
            window.location.href = "/products";
          }
        },
        error: function() {
          console.log('Error: From Utilities.js')
        }
      })
    }
  });

  // $('button').on('click', function() {
  //
  //   $.ajax({
  //     url: "/test/" + this.id,
  //     type: "GET",
  //     data: this.id,
  //     success: function(data){
  //       window.location.href = "http://localhost:3000/product";
  //     }
  //   })
  // });

  $('.manybox').on('click', function() {
    console.log('Temp: ', this.id);
    $.ajax({
      url: "/test/" + this.id,
      type: "GET",
      data: this.id,
      success: function(data){
        window.location.href = "/product";
      }
    })
  });

});



// $('#text-form').on('submit', function(e) {
//   e.preventDefault();
//   var text = $('#searchText').val().toLowerCase();
//   $('#text-form')[0].reset();
//
//   $.ajax({
//     url: '/products',
//     type: 'POST',
//     contentType: 'application/json',
//     data: JSON.stringify({text}),
//     success: function(data) {
//       if(data.error) {
//         alert('Product not found');
//       }
//       console.log('Success! \n', data);
//       var name = data.name.toLowerCase();
//       if (name.indexOf(text) > -1) {
//         window.location.replace("http://localhost:3000/");
//       }
//     },
//     error: function() {
//       console.log('error');
//     }
//   });
// });
