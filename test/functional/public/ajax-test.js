require.paths.unshift('./turing-test/lib');

var test = require('test'),
    assert = require('assert');

function mixinExpect(m) {
  var m2 = {}, method;

  for (method in m) {
    if (m.hasOwnProperty(method)) {
      m2['__' + method] = m[method];
      (function(methodName) {
        m2[methodName] = function() {
          m2.mixinExpectAssertionCount++;
          m2['__' + methodName].apply(m2, arguments);
        };
      }(method));
    }
  }

  m2.expect = function(count) {
    m2.mixinExpectAssertionCount = 0;
    m2.mixinExpectExpected = count;
  };

  m2.done = function() {
    if (m2.mixinExpectAssertionCount !== m2.mixinExpectExpected) {
      throw('Expected assertion count was not found, expected: ' + m2.mixinExpectExpected + ', got: ' + m2.mixinExpectAssertionCount); 
    }
  };

  return m2;
}

function Expect() {
  this.expectations = {};
}

Expect.prototype = {
  add: function(expectation) {
    this.expectations[expectation] = false;
  },

  fulfill: function(expectation) {
    this.expectations[expectation] = true;
  },

  done: function() {
    for (var expectation in this.expectations) {
      if (!this.expectations[expectation]) {
        throw('Expected assertion was fulfilled , expected: ' + expectation); 
      }
    }
  }
};

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
  },

  'test queue loading with remote': function() {
    $t.require([
      'https://ajax.googleapis.com/ajax/libs/webfont/1.0.22/webfont.js',
      '/load-me.js?test10=10',
      '/load-me.js?test11=11'
    ]).on('complete', function() {
      assert.ok(true);
    }).on('loaded', function(item) {
      if (item.src === 'https://ajax.googleapis.com/ajax/libs/webfont/1.0.22/webfont.js') {
        assert.equal(typeof test11, 'undefined', 'test11 should not be set when remote is loaded');
        assert.ok(window.WebFont, 'WebFont should be set');
      }

      if (item.src === '/load-me.js?test10=10') {
        assert.equal(typeof test11, 'undefined', 'test11 should not be set when test10 is loaded');
        assert.equal(test10, 10, 'test10 should be set when test10 is loaded');
      }

      if (item.src === '/load-me.js?test11=11') {
        assert.ok(window.WebFont);
        assert.equal(test11, 11);
        assert.equal(test10, 10);
      }
    });
  },

  'test queue loading with remote in the middle': function() {
    var assertExpect = mixinExpect(assert);
    assertExpect.expect(9);

    $t.require([
      '/load-me.js?test12=12',
      'https://ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js',
      '/load-me.js?test13=13'
    ]).on('complete', function() {
      assertExpect.ok(true);
      assertExpect.done();
    }).on('loaded', function(item) {
      if (item.src === 'https://ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js') {
        assertExpect.equal(typeof test13, 'undefined', 'test13 should not be set when remote is loaded');
        assertExpect.ok(window.swfobject, 'swfobject should be set');
      }

      if (item.src === '/load-me.js?test12=12') {
        assertExpect.ok(!window.swfobject, 'swfobject should not be set when test12 is loaded');
        assertExpect.equal(typeof test13, 'undefined', 'test13 should not be set when test12 is loaded');
        assertExpect.equal(test12, 12, 'test12 should be set when test12 is loaded');
      }

      if (item.src === '/load-me.js?test13=13') {
        assertExpect.ok(window.swfobject);
        assertExpect.equal(test13, 13);
        assertExpect.equal(test12, 12);
      }
    });
  },

  'test queue loading with no local scripts': function() {
    var expect = new Expect();
    expect.add('jQuery was set');
    expect.add('loaded fired');

    $t.require([
      'https://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js'
    ]).on('complete', function() {
      assert.ok(true);
      expect.fulfill('loaded fired');
      expect.done();
    }).on('loaded', function(item) {
      if (item.src === 'https://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js') {
        expect.fulfill('jQuery was set');
        assert.ok(jQuery, 'jQuery should be set');
      }
    });
  }
};

test.run(exports);
