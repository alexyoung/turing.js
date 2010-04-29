load('riot.js');
Riot.require('../turing.core.js');
Riot.require('../turing.dom.js');
Riot.require('../turing.events.js');

Riot.context('turing.events.js', function() {
  given('an element', function() {
    var element = turing.dom.get('#events-test a')[0],
        check = 0,
        callback = function(e) { check++; return false; };

    should('add onclick', function() {
      check = 0;
      turing.events.add(element, 'click', callback);
      turing.events.fire(element, 'click');
      turing.events.remove(element, 'click', callback);
      return check;
    }).equals(1);

    should('remove onclick', function() {
      check = 0;
      turing.events.add(element, 'click', callback);
      turing.events.fire(element, 'click');
      turing.events.remove(element, 'click', callback);
      turing.events.fire(element, 'click');
      return check;
    }).equals(1);
  });

  given('a container element', function() {
    should('set the correct element in event.target', function() {
      var lastResult = '',
          callback = function(event) { lastResult = event.target.innerHTML; };

      turing.events.add(document, 'click', callback);
      turing.events.fire(turing.dom.get('.clickme')[0], 'click');
      return lastResult;
    }).equals('Text');
  });
});

Riot.run();

