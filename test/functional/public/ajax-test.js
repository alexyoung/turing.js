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
    $t.require('/load-me.js?test0=0', { transport: 'scriptInsertion' }, function() {
      assert.equal(window.test0, 0);
    });
  },

  'test require execution': function() {
    $t.require('/load-me.js?test1=1', { async: true, defer: true, transport: 'scriptInsertion' }, function() {
      assert.equal(window.test1, 1);
    });

    $t.require('/load-me.js?test2=2', { transport: 'scriptInsertion' }, function() {
      assert.equal(window.test2, 2);
    });
  },

  'test require with XMLHttpRequest': function() {
    $t.require('/load-me.js?test3=3', { transport: 'XMLHttpRequest' }, function() {
      assert.equal(window.test3, 3);
    });
  },

  'test turing.require.isSameOrigin': function() {
    assert.ok(turing.require.isSameOrigin('/example.js'));
    assert.ok(turing.require.isSameOrigin(location.protocol + '//' + location.host + '/example.js'));
    assert.ok(!turing.require.isSameOrigin('https://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js'));
  },

  'test async queue loading': function() {
    $t.require([
      '/load-me.js?test9=9',
      ['/load-me.js?test4=4', '/load-me.js?test5=5'],
      ['/load-me.js?test6=6', '/load-me.js?test7=7'],
      '/load-me.js?test8=8'
    ]).on('complete', function() {
      assert.ok(true);
    }).on('loaded', function(item) {
      if (item.src === '/load-me.js?test9=9') {
        assert.equal(typeof test4, 'undefined');
      }

      if (item.src === '/load-me.js?test4=4') {
        assert.equal(test9, 9);
        assert.equal(test4, 4);
        assert.equal(typeof test6, 'undefined');
        assert.equal(typeof test8, 'undefined');
      }

      if (item.src === '/load-me.js?test6=6') {
        assert.equal(test9, 9);
        assert.equal(test4, 4);
        assert.equal(test6, 6);
        assert.equal(typeof test8, 'undefined');
      }
    });
  }
};

test.run(exports);
