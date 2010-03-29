load('riot.js');
Riot.require('../turing.core.js');

Riot.context('turing.core.js', function() {
  given('the turing object', function() {
    should('be global and accessible', turing).isNotNull();
    should('return a VERSION', turing.VERSION).isNotNull();
    should('be turing complete', true).isTrue();
  });

  given('an object', function() {
    var fn = function(n) { return this.value + 1; },
        item = null;

    function Item(value) {
      this.value = value;
    }

    item = new Item(100);

    should('bind correctly', turing.bind(fn, item)()).equals(101);
  });
});

Riot.run();
