$(document).ready(function(){

  $("#searchText").on('focus', function(){
    $.get('/product_titles', function(data){
        $('#searchText').autocomplete({
          source: data.strTitles
        });
    });
  });

  $('#searchText').on('keypress', function(e){
    var text = $('#searchText').val().toLowerCase().trim();
    if(e.which == 13 && text.length > 0){
      $.ajax({
        url: '/product_search',
        type: 'GET',
        data: {searchText: text},
        success: function(data) {
          if(data.error || data.docs.length === 0) {
            alert('Product not found');
          } else if (data.docs.length === 1) {
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

  $('.manybox').on('click', function() {
    $.ajax({
      url: "/product_search/" + this.id,
      type: "GET",
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


// $('#scanItem').on('click', function() {
//
//   navigator.getUserMedia = navigator.getUserMedia ||
//                        navigator.webkitGetUserMedia ||
//                        navigator.mozGetUserMedia;
//
//   if (navigator.getUserMedia) {
//      navigator.getUserMedia({ audio: true, video: { width: 1280, height: 720 } },
//         function(stream) {
//            var video = document.querySelector('video');
//            video.src = window.URL.createObjectURL(stream);
//            video.onloadedmetadata = function(e) {
//              video.play();
//            };
//         },
//         function(err) {
//            console.log("The following error occured: " + err.name);
//         }
//      );
//   } else {
//      console.log("getUserMedia not supported");
//   }
//
// });




// var items = arr.filter(function(name){
//   return name.indexOf(val) > -1;
// })
