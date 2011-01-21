require.paths.unshift('./turing-test/lib');

if (typeof turing === 'undefined')
  t = require('../turing.core.js');

/**
 * This is used by Node because of the differences in global handling
 * between browsers and CommonJS modules.
 */
function correctContext() {
  if (typeof turing === 'undefined') {
    turing = t.turing;
    $t = t.$t;
  }
}

var test = require('test'),
    assert = require('assert');

exports.testAlias = {
  'test turing is present': function() {
    correctContext();
    assert.ok(turing.VERSION, 'turing.core should have loaded');
  },

  'test alias exists': function() {
    correctContext();
    assert.ok($t.VERSION, 'the $t alias should be available');
  }
};

test.run(exports);
