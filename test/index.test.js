var assert = require('assert')
  , turing = require(__dirname + '/../lib/index.js');

assert.ok(turing.Promise);

var sum = 0;
turing.enumerable.each([1, 2, 3], function(i) {
  sum += i;
});
assert.equal(6, sum);

turing.browser('<p><a class="the-link" href="http://jsdom.org">JSDOM\'s Homepage</a></p>', function(turing) {
  var triggered = 0;
  assert.equal(1, turing('p').length);
  turing('a').bind('click', function() {
    triggered++;
  });
  turing.events.fire(turing('a')[0], 'click');
  assert.equal(1, triggered);
});
