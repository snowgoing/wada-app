$(document).ready(function(){
  // $(window).on('load', function(){
  //   var el = $('#searchText'),
  //       val = el.val(),
  //       url = 'http://localhost:3000/products',
  //       arr = [];
  //
  //   console.log(val);
  //
  //   $.get(url, function(data){
  //     if (data) {
  //       arr = data.map(function(prod) {
  //         return prod.name;
  //       });
  //       $('#searchText').autocomplete({
  //         source: arr
  //       });
  //     }
  //     console.log('Data retrieved from Server: ', arr);
  // });

  $('#text-form').on('submit', function(e) {
    e.preventDefault();
    var text = $('#searchText').val();
    $('#text-form')[0].reset();

    $.ajax({
      url: '/products',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({text}),
      success: function(data) {
        console.log('Success! \n', data);
        if (data.name === text) {
          window.location.replace("http://localhost:3000/");
        }
      },
      error: function() {
        console.log('error');
      }
    });
  });

  $("#searchText").on('focus', function(){
    var el = $('#searchText'),
        val = el.val(),
        url = 'http://localhost:3000/products',
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

});
