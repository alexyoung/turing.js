require.paths.unshift('./turing-test/lib');

turing = require('../turing.core.js').turing;
var test = require('test'),
    assert = require('assert');

require('../turing.oo.js');
require('../turing.functional.js');
require('../turing.enumerable.js');

exports.testEnumerable = {
  'test array iteration with each': function() {
    var a = [1, 2, 3, 4, 5],
        count = 0;
    turing.enumerable.each(a, function(n) { count += 1; });
    assert.equal(5, count, 'count should have been iterated');
  },

  'test array iteration with map': function() {
    var a = [1, 2, 3, 4, 5],
        b = turing.enumerable.map(a, function(n) { return n + 1; });
    assert.deepEqual([2, 3, 4, 5, 6], b, 'map should iterate');
  },

  'test array filtering': function() {
    var a = [1, 2, 3, 4, 5];
    assert.deepEqual([2, 4], turing.enumerable.filter(a, function(n) { return n % 2 == 0; }), 'array should be filtered');
  },

  'test array reject': function() {
    var a = [1, 2, 3, 4, 5];
    assert.deepEqual([1, 3, 5], turing.enumerable.reject(a, function(n) { return n % 2 == 0; }), 'items should have been rejected');
  },

  'test finding values with detect': function() {
    var a = [1, 2, 3, 4, 5];
    assert.ok(turing.enumerable.detect(a, function(n) { return n == 1; }), 'detect should find the item');
  },

  'test detect does not find items that do not exist': function() {
    var a = [1, 2, 3, 4, 5];
    assert.equal(null, turing.enumerable.detect(a, function(n) { return n == 1000; }));
  },

  'test chained method calls': function() {
    assert.deepEqual([20, 40], turing.enumerable.chain([1, 2, 3, 4])
      .filter(function(n) { return n % 2 == 0; })
      .map(function(n) { return n * 10; })
      .values());
  },

  'test reduce results accumulation': function() {
    assert.equal(6, turing.enumerable.reduce([1, 2, 3], 0, function(memo, n) { return memo + n; }));
  },

  'test flatten': function() {
    assert.deepEqual([2, 4, 6, 8], turing.enumerable.flatten([[2, 4], [[6], 8]]));
  },

  'test method invocation': function() {
    assert.deepEqual(['hel', 'wor'], turing.enumerable.invoke(['hello', 'world'], 'substring', 0, 3));
  },

  'test pluck': function() {
    assert.deepEqual([5, 5, 4, 2, 4], turing.enumerable.pluck(['hello', 'world', 'this', 'is', 'nice'], 'length'));
  },

  'test tail': function() {
    assert.deepEqual([2, 3, 4, 5], turing.enumerable.tail([1, 2, 3, 4, 5]));
  },

  'test tail skip': function() {
    assert.deepEqual([4, 5], turing.enumerable.tail([1, 2, 3, 4, 5], 3));
  },
  
  'test return false from some when an array is empty': function() {
    assert.equal(false, turing.enumerable.some([]));
  },

  'test return true from some when an array has items': function() {
    assert.ok(turing.enumerable.some([1, 2, 3]));
  },

  'test return true from some when an array matches a callback': function() {
    assert.ok(turing.enumerable.some([1, 2, 3], function(value) { return value === 3; }));
  },

  'test check callback returns true for every item with all': function() {
    assert.ok(turing.enumerable.all([1, 2, 3], function(value) { return value < 4; }));
  },

  'test check callback returns false with all when callback returns false': function() {
    assert.equal(false, turing.enumerable.all([1, 2, 3], function(value) { return value > 4; }));
  },

  'test finds values with include': function() {
    assert.ok(turing.enumerable.include([1, 2, 3], 3));
  },

  'test objects iterate with each': function() {
    var obj = { one: '1', two: '2', three: '3' },
        count = 0;
    turing.enumerable.each(obj, function(n) { count += 1; });
    assert.equal(3, count);
  },

  'test iterate objects with map': function() {
    var obj = { one: '1', two: '2', three: '3' };
    assert.deepEqual(['11', '21', '31'], turing.enumerable.map(obj, function(n) { return n + 1; }));
  },

  'test filter objects and return a multi-dimensional array': function() {
    var obj = { one: '1', two: '2', three: '3' };
    assert.equal('one', turing.enumerable.filter(obj, function(v, i) { return v < 2; })[0][0]);
  },

  'test check callback returns true for every item with all': function() {
    var obj = { one: '1', two: '2', three: '3' };
    assert.ok(turing.enumerable.all(obj, function(value, key) { return value < 4; }));
  },

  'test check callback returns false with all when callback returns false': function() {
    var obj = { one: '1', two: '2', three: '3' };
    assert.equal(false, turing.enumerable.all(obj, function(value, key) { return value > 4; }));
  },

  'test finds values with include': function() {
    var obj = { one: '1', two: '2', three: '3' };
    assert.ok(turing.enumerable.include(obj, '3'));
  }
};

test.run(exports);

