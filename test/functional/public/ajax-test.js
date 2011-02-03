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
  },

  'test json post object': function() {
    $t.post('/post-test', {
      postBody: { key: 'value' },
      success: function(r) {
        assert.equal('value', r.responseText);
      },
      error: function() {
        assert.ok(false);
      }
    });
  },

  'test json post object with application/json': function() {
    $t.post('/post-test', {
      postBody: '{"key":"value"}',
      contentType: 'application/json', 
      success: function(r) {
        assert.equal('value', r.responseText);
      },
      error: function() {
        assert.ok(false);
      }
    });
  },

  'test json post array with application/json': function() {
    $t.post('/post-array', {
      postBody: '["value"]',
      contentType: 'application/json', 
      success: function(r) {
        assert.equal('value', r.responseText);
      },
      error: function() {
        assert.ok(false);
      }
    });
  },

  'test json parsing': function() {
    $t.post('/give-me-json', {
      contentType: 'application/json', 
      success: function(r) {
        assert.equal('value', r.responseJSON.key);
      }
    });
  }
};

test.run(exports);

