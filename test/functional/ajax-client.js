require.paths.unshift('./turing-test/lib');

var test = require('test'),
    assert = require('assert');

exports.testAjax = {
  'test ajax get': function() {
    $t.get('/get-test', {
      success: function(r) {
        assert.equal('{"key":"value"}', r.responseText);
      }
    });
  },

  'test ajax post': function() {
    $t.post('/post-test', {
      postBody: 'key=value&anotherKey=anotherValue',
      success: function(r) {
        assert.equal('value', r.responseText);
      }
    });
  }
};

test.run(exports);

