require.paths.unshift('./turing-test/lib');

if (typeof turing === 'undefined')
  turing = require('../turing.core.js').turing;

var test = require('test'),
    assert = require('assert');

require('../turing.net.js');

exports.testNet = {
  'test request creation': function() {
    var response,
        request = turing.net.get('/test', {
          'error': function(r) { response = r; }
        });

    assert.ok(request.readyState);
  },

  'test jsonp creation': function() {
    turing.net.jsonp('http://feeds.delicious.com/v1/json/alex_young/javascript?callback={callback}', { success: function(json) { }});
  }
};

test.run(exports);
