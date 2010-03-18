load('riot.js');
Riot.require('../turing.core.js');
Riot.require('../turing.numeric.js');
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
  });
});

Riot.run();
