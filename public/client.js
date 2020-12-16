// NEDB >>> get rid of the jquery, blegh!

// client-side js
// run by the browser each time your view template is loaded

// by default, you've got jQuery,
// add other scripts at the bottom of index.html

$(function() {
  $.get('/users', function(users) {
    users.forEach(function(user) {
      $('<li></li>').text(user[0] + " " + user[1]).appendTo('ul#users');
    });
  });

  $('form').submit(function(event) {
    event.preventDefault();
    var fName = $('input#fName').val();
    var lName = $('input#lName').val();
    $.post('/users?' + $.param({fName:fName, lName:lName}), function() {
      $('<li></li>').text(fName + " " + lName).appendTo('ul#users');
      $('input#fName').val('');
      $('input#lName').val('');
      $('input').focus();
    });
  });
});



// long css shadow
let shadowString = '';
let shadowColor = 33;

for (let i = 0; i < 100; i++) {
  shadowColor+=5;
  shadowString += `${i*5}px ${i*5}px rgba(${255 - shadowColor}, ${200 - shadowColor}, ${shadowColor}, ${((200 - i) / 800)}), `;
  shadowString += `${-i*5}px ${i*5}px rgba(${255 - shadowColor}, ${200 - shadowColor}, ${shadowColor}, ${((200 - i) / 800)}), `;
  // shadowString += i + 'px ' + i + 'px rgba(128,55,128,' + ((200 - i) / 800) + '), ';
}
shadowString = shadowString.substr(0, shadowString.length - 2);

let longShadowEls = document.querySelectorAll(".longShadow");

for (let i = 0; i < longShadowEls.length; i++) {
  longShadowEls[i].style.boxShadow = shadowString;
}
