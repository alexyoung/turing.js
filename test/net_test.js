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

  given('a jsonp request', function() {
    // There's currently no way to test this due to the async nature
    turing.net.jsonp('http://feeds.delicious.com/v1/json/alex_young/javascript?callback={callback}', { success: function(json) { }});
  });
});

Riot.run();
