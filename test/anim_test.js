Riot.require('../turing.core.js');
Riot.require('../turing.anim.js');

Riot.context('turing.anim.js', function() {
  given('a box to change', function() {
    var box = document.getElementById('box');
    turing.anim.animate(box, 1000, { 'marginLeft': '8em', 'marginTop': '100px' });
  });
});

Riot.run();
