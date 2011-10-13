require.paths.unshift('./turing-test/lib');

var test = require('test'),
    assert = require('assert');

exports.testAjax = {
  'test ajax get': function() {
    $t.get('/get-test')
      .set('Accept', 'text/html')
      .end(function(res) {
        assert.equal('Sample text', res.responseText);
      });
  },

  'test ajax post': function() {
    $t.post('/post-test')
      .data('key=value&anotherKey=anotherValue')
      .end(function(res) {
        assert.equal('value', res.responseText);
      });
  },

  'test send with data': function() {
    $t.post('/post-test')
      .send('key=value&anotherKey=anotherValue', function(res) {
        assert.equal('value', res.responseText);
      });
  },

  'test json post object': function() {
    $t.post('/post-test')
      .data({ key: 'value' })
      .end(function(res) {
        assert.equal('value', res.responseText);
      });
  },

  'test error handling': function() {
    $t.get('/error')
      .end(function(res) {
        assert.equal(500, res.status);
        assert.equal(false, res.success);
      });
  },

  'test json post object with application/json': function() {
    $t.post('/post-test')
      .data({ 'key': 'value' })
      .set('Content-Type', 'application/json')
      .end(function(res) {
        assert.equal('value', res.responseText);
      });
  },

  'test json post array with application/json': function() {
    $t.post('/post-array')
      .data(['value'])
      .set('Content-Type', 'application/json')
      .end(function(res) {
        assert.equal('value', res.responseText);
      });
  },

  'test promises': function() {
    $t.get('/get-test').then(
      function(r) { assert.equal('Sample text', r.responseText); },
      function(r) { assert.ok(false); }
    );
  },

  'test json parsing': function() {
    $t.post('/give-me-json')
      .set('Content-Type', 'application/json')
      .end(function(res) {
        assert.equal('value', res.responseJSON.key);
      });
  },

  'test xml parsing': function() {
    $t.post('/give-me-xml')
      .set('Content-Type', 'application/xml')
      .end(function(res) {
        assert.equal('key', res.responseXML.documentElement.nodeName);
      });
  }
};

exports.testRequire = {
  'test require': function() {
    $t.require('/load-me.js', function() {
      assert.equal(loadMeDone, 1);
    });
  },

  'test require execution': function() {
    $t.require('/load-me.js', { async: true, defer: true }, function() {
      assert.equal(loadMeDone, 1);
    });

    $t.require('/load-me.js', { async: true, defer: true });
    $t.require('/load-me.js');

    $t.require('/load-me.js', function() {
      assert.equal(loadMeDone, 1);
    });
  }
};

test.run(exports);
