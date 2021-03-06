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
let shadowColor = 60;

for (let i = 0; i < 100; i++) {
  shadowColor+=5;
  shadowString += `${i*5}px ${i*5}px rgba(${255 - shadowColor}, ${200 - shadowColor}, ${shadowColor}, ${((60 - i) / 3000)}), `;
  shadowString += `${-i*5}px ${i*5}px rgba(${255 - shadowColor}, ${200 - shadowColor}, ${shadowColor}, ${((60 - i) / 3000)}), `;
  // shadowString += i + 'px ' + i + 'px rgba(128,55,128,' + ((200 - i) / 800) + '), ';
}
shadowString = shadowString.substr(0, shadowString.length - 2);

let longShadowEls = document.querySelectorAll(".longShadow");

for (let i = 0; i < longShadowEls.length; i++) {
  longShadowEls[i].style.boxShadow = shadowString;
}


// >>>>>   ong css shadow - Green
shadowString = '';
shadowColor = 10;

for (let i = 0; i < 30; i++) {
  shadowColor+=5;
  shadowString += `${i*3}px ${i*5}px rgba(${200 - shadowColor * 3}, ${180 - shadowColor}, ${shadowColor}, ${((60 - i) / 3000)}), `;
  shadowString += `${-i*3}px ${i*5}px rgba(${200 - shadowColor * 3}, ${180 - shadowColor}, ${shadowColor}, ${((60 - i) / 3000)}), `;
  // shadowString += i + 'px ' + i + 'px rgba(128,55,128,' + ((200 - i) / 800) + '), ';
}
shadowString = shadowString.substr(0, shadowString.length - 2);

let longShadowGreenEls = document.querySelectorAll(".longShadowGreen");

for (let i = 0; i < longShadowGreenEls.length; i++) {
  longShadowGreenEls[i].style.boxShadow = shadowString;
}



/*

  Simple version of translating text using css
  https://codepen.io/JoshuaCarroll/pen/pyGYwa

*/


 function setLang(language) {
    document.getElementById("langElement").lang = language;

    // Not really needed, see below.
      setCookie("lang", language, 365);
      console.log("setting language",language)
}
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length,c.length);
        }
    }
    return "";
}

    document.getElementById("langElement").lang = getCookie("lang");



// text textScrambleContainer
// ——————————————————————————————————————————————————
// TextScramble
// ——————————————————————————————————————————————————

class TextScramble {
  constructor(el) {
    this.el = el
    this.chars = '!<>-_\\/[]{}—=+*^?#________'
    this.update = this.update.bind(this)
  }
  setText(newText) {
    const oldText = this.el.innerText
    const length = Math.max(oldText.length, newText.length)
    const promise = new Promise((resolve) => this.resolve = resolve)
    this.queue = []
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || ''
      const to = newText[i] || ''
      const start = Math.floor(Math.random() * 40)
      const end = start + Math.floor(Math.random() * 40)
      this.queue.push({ from, to, start, end })
    }
    cancelAnimationFrame(this.frameRequest)
    this.frame = 0
    this.update()
    return promise
  }
  update() {
    let output = ''
    let complete = 0
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i]
      if (this.frame >= end) {
        complete++
        output += to
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar()
          this.queue[i].char = char
        }
        output += `<span class="dud">${char}</span>`
      } else {
        output += from
      }
    }
    this.el.innerHTML = output
    if (complete === this.queue.length) {
      this.resolve()
    } else {
      this.frameRequest = requestAnimationFrame(this.update)
      this.frame++
    }
  }
  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)]
  }
}

// ——————————————————————————————————————————————————
// Example scrambled text
// ——————————————————————————————————————————————————
//
// const phrases = [
//   'Circalunar clocks',
//   'Mass spawning timed with moon',
//   // 'Coral of inner Great Barrier Reef spawn after the full moon in October',
//   'Coral of outer Great Barrier Reef spawn after the full moon in November'
// ]
//
// const el = document.querySelector('.text')
// const fx = new TextScramble(el)
//
// let counter = 0
// const next = () => {
//   fx.setText(phrases[counter]).then(() => {
//     setTimeout(next, 800)
//   })
//   counter = (counter + 1) % phrases.length
// }
//
// next()
