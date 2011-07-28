var assert = require('assert')
  , turing = require(__dirname + '/../lib/index.js');

assert.ok(turing.Promise);

var sum = 0;
turing.enumerable.each([1, 2, 3], function(i) {
  sum += i;
});
assert.equal(6, sum);
