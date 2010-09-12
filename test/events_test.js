load('riot.js');
Riot.require('../turing.core.js');
Riot.require('../turing.dom.js');
Riot.require('../turing.events.js');

Riot.context('turing.events.js', function() {
  given('a delegate handler', function() {
    var clicks = 0;
    turing.events.delegate(document, '#events-test a', 'click', function(e) {
      clicks++;
    });

    should('run the handler when the right selector is matched', function() {
      turing.events.fire(turing.dom.get('#events-test a')[0], 'click');
      return clicks;
    }).equals(1);

    should('only run when expected', function() {
      turing.events.fire(turing.dom.get('p')[0], 'click');
      return clicks;
    }).equals(1);
  });

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

    should('bind events using the chained API', function() {
      var clicks = 0;
      turing('#events-test a').bind('click', function() { clicks++; });
      turing.events.fire(element, 'click');
      return clicks;
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
      turing.events.remove(document, 'click', callback);
      return lastResult;
    }).equals('Text');

    should('stop', function() {
      var callback = function(event) { event.stop(); };
      turing.events.add(turing.dom.get('#link2')[0], 'click', callback);
      turing.events.fire(turing.dom.get('#link2')[0], 'click');
      return window.location.hash;
    }).equals('');
  });
});

Riot.run();

