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
  });
});

Riot.run();
