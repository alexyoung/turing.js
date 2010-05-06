load('riot.js');

document = {};
document.getElementsByTagName = function() { return []; };
document.attachEvent = function() {};

Riot.require('../turing.core.js');
Riot.require('../turing.oo.js');
Riot.require('../turing.enumerable.js');
Riot.require('../turing.dom.js');
Riot.require('../turing.events.js');
Riot.require('../turing.alias.js');

Riot.context('turing.alias.js', function() {
  given('the turing object', function() {
    should('automatically search for selectors', $t('.selector')).isNotNull();
    should('alias enumerable methods', $t.each).isEqual(turing.enumerable.each);
    should('alias dom', $t.dom).isEqual(turing.dom);
    should('alias events', $t.events).isEqual(turing.events);
  });
});

Riot.run();
