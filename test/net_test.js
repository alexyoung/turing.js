load('riot.js');
Riot.require('../turing.core.js');
Riot.require('../turing.net.js');

Riot.context('turing.net.js', function() {
  given('a request', function() {
    var response,
        request = turing.net.get('/test', {
          'error': function(r) { response = r; }
        });

    should('generate a request object', request.readyState).isEqual(0);
  });
});

Riot.run();
