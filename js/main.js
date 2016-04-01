(function() {
  'use strict';

  var idx = lunr(function () {
    this.field('id');
    this.field('content');
    this.field('title', { boost: 10 });
  });

  var data = $.getJSON('/search_data.json');

  data.then(function(loaded_data) {
    $.each(loaded_data, function(index, value) {
      idx.add($.extend({ id: index }, value));
    });
  });

  $('#search').on('submit', function(e) {
    e.preventDefault();
    var query = $('#search input').val();
    if(query.length) {
      var results = idx.search(query);
      display_search_results(results);
    }
    else {
      window.location.href = '/';
    }
  });

  function display_search_results(results) {
    var $search_results = $('.content');

    $search_results.html('<h1>Search Resuls</h1>');

    data.then(function(loaded_data) {
      if(results.length) {
        results.forEach(function(result) {
          var item = loaded_data[result.ref];
          var appendString = '' +
            '<li><a href="' + item.url + '">' + item.title + '</a></li>';
          $search_results.append(appendString);
        });
      } else {
        $search_results.append('<li>No results found</li>');
      }
    });
  }

  $('form.contact').on('submit', function(e) {
    e.preventDefault();

    var name = $('#name').val();
    var email = $('#email').val();
    var message = $('#message').val();

    if(formIsValid(email, message, name)) {
      $.ajax({
        url: '//formspree.io/thebeautyinfull@gmail.com',
        method: 'POST',
        dataType: 'json',
        data: {
          from: name,
          email: email,
          message: message
        },
      }).done(function() {
        window.location.href = '/thanks/';
      });
    }
    else {
      $('form.contact button')
        .addClass('animated shake')
        .one(
          'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
          function() {
            $(this).removeClass('animated shake');
          }
        );
    }
  });

  function formIsValid(email, message, name) {
    return emailIsValid(email) > 0 && message.length > 5
      && message.length < 800 && name.length > 0 && name.length < 200;
  }

  function emailIsValid(email) {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

})();
