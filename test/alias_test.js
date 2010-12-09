require.paths.unshift('./turing-test/lib');

turing = require('../turing.core.js').turing;
var test = require('test'),
    assert = require('assert'),
    $t = require('../turing.alias.js');

exports.testAlias = {
  'test turing is present': function() {
    assert.equal(turing.VERSION, '0.0.41', 'turing.core should have loaded');
  },

  'test alias exists': function() {
    assert.ok($t, 'the $t alias should be available');
  }
};

test.run(exports);
