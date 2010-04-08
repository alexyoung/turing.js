load('riot.js');
Riot.require('../turing.core.js');
Riot.require('../turing.oo.js');
Riot.require('../turing.functional.js');
Riot.require('../turing.enumerable.js');

Riot.context('turing.enumerable.js', function() {
  given('an array', function() {
    var a = [1, 2, 3, 4, 5];
    should('iterate with each', function() {
      var count = 0;
      turing.enumerable.each(a, function(n) { count += 1; });
      return count;
    }).equals(5);

    should('iterate with map', function() {
      return turing.enumerable.map(a, function(n) { return n + 1; });
    }).equals([2, 3, 4, 5, 6]);

    should('filter arrays', function() {
      return turing.enumerable.filter(a, function(n) { return n % 2 == 0; });
    }).equals([2, 4]);

    should('reject arrays', function() {
      return turing.enumerable.reject(a, function(n) { return n % 2 == 0; });
    }).equals([1, 3, 5]);

    should('find values with detect', function() {
      return turing.enumerable.detect(a, function(n) { return n == 1; });
    });

    should('not find values with detect that do not exist', function() {
      return typeof turing.enumerable.detect(a, function(n) { return n == 1000; }) === 'undefined';
    });

    should('chain method calls', function() {
      return turing.enumerable.chain([1, 2, 3, 4]).filter(function(n) { return n % 2 == 0; }).map(function(n) { return n * 10; }).values();
    }).equals([20, 40]);

    should('accumulate results with reduce', function() {
      return turing.enumerable.reduce([1, 2, 3], 0, function(memo, n) { return memo + n; });
    }).equals(6);

    should('flatten an array', function() {
      return turing.enumerable.flatten([[2, 4], [[6], 8]]);
    }).equals([2, 4, 6, 8])

    should('invoke methods on arrays', function() {
      return turing.enumerable.invoke(['hello', 'world'], 'substring', 0, 3);
    }).equals(['hel', 'wor']);

    should('pluck properties from arrays', function() {
      return turing.enumerable.pluck(['hello', 'world', 'this', 'is', 'nice'], 'length');
    }).equals([5, 5, 4, 2, 4]);

    should('tail by skipping the first element', function() {
      return turing.enumerable.tail([1, 2, 3, 4, 5]);
    }).equals([2, 3, 4, 5]);

    should('tail by skipping an optional number of elements', function() {
      return turing.enumerable.tail([1, 2, 3, 4, 5], 3);
    }).equals([4, 5]);

    should('return false from some when an array is empty', function() {
      return turing.enumerable.some([]);
    }).isFalse();

    should('return true from some when an array has items', function() {
      return turing.enumerable.some([1, 2, 3]);
    }).isTrue();

    should('return true from some when an array matches a callback', function() {
      return turing.enumerable.some([1, 2, 3], function(value) { return value === 3; });
    }).isTrue();

    should('check callback returns true for every item with all', function() {
      return turing.enumerable.all([1, 2, 3], function(value) { return value < 4; });
    }).isTrue();

    should('check callback returns false with all when callback returns false', function() {
      return turing.enumerable.all([1, 2, 3], function(value) { return value > 4; });
    }).isFalse();

    should('find values with include', function() {
      return turing.enumerable.include([1, 2, 3], 3);
    }).isTrue();
  });

  given('an object', function() {
    var obj = { one: '1', two: '2', three: '3' };
    should('iterate with each', function() {
      var count = 0;
      turing.enumerable.each(obj, function(n) { count += 1; });
      return count;
    }).equals(3);

    should('iterate with map', function() {
      return turing.enumerable.map(obj, function(n) { return n + 1; });
    }).equals(['11', '21', '31']);

    should('filter objects and return a multi-dimensional array', function() {
      return turing.enumerable.filter(obj, function(v, i) { return v < 2; })[0][0];
    }).equals('one');

    should('check callback returns true for every item with all', function() {
      return turing.enumerable.all(obj, function(value, key) { return value < 4; });
    }).isTrue();

    should('check callback returns false with all when callback returns false', function() {
      return turing.enumerable.all(obj, function(value, key) { return value > 4; });
    }).isFalse();

    should('find values with include', function() {
      return turing.enumerable.include(obj, '3');
    }).isTrue();
  });
});

Riot.run();
