// NOTE: Must be run from the tests directory for now until I can figure out paths for the web tests
if (typeof TuringTest === 'undefined') {
  require.paths.unshift('./');
  var TuringTest = require('turing-test/turing-test');
}

TuringTest.init({
  webRelativePath: 'turing-test/',
  webScripts: ['../turing.core.js', '../turing.alias.js'],
  eval: eval
});

var test = TuringTest.test,
    assert = TuringTest.assert;

exports.testAlias = {
  'test turing is present': function() {
    assert.ok(turing, 'turing.core should have loaded');
  },

  'test alias exists': function() {
    assert.ok($t, 'the $t alias should be available');
  }
};

test.run(exports);

