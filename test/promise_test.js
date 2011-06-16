require.paths.unshift('./turing-test/lib');

if (typeof turing === 'undefined')
  turing = require('../turing.core.js').turing;

require('../turing.promise.js');

var test = require('test'),
    assert = require('assert');

exports.testPromise = {
  'test then': function() {
    function delay(ms) {
      var p = new turing.Promise();
      setTimeout(p.resolve, ms);
      return p;
    }

    function timeout(duration, limit) {
      var p = new turing.Promise();
      setTimeout(p.resolve, duration);
      setTimeout(p.reject, limit);
      return p;
    }

    delay(1000).then(function() {
      assert.ok('Delay completed');
    });

    timeout(10, 100).then(
      function() {
        assert.ok('10ms is under 100ms');
      },
      function() {
        assert.fail();
      }
    );

    timeout(100, 10).then(
      function() {
        assert.fail();
      },
      function() {
        assert.ok('100ms is over 10ms');
      }
    );
  },

  'test chain': function() {
    var start = (new Date()).valueOf();

    turing().delay(1010).then(function() {
      assert.ok((new Date()).valueOf() - start >= 1000);
    });
  }
};

test.run(exports);

