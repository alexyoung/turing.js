load('benchmark.js');

// Ignore the IE stats for this one
function eachNative(enumerable, callback, context) {
  if (Array.prototype.forEach && enumerable.forEach === Array.prototype.forEach) {
    enumerable.forEach(callback, context);
  }
}

function eachNumerical(enumerable, callback, context) {
  for (var i = 0, l = enumerable.length; i < l; i++) callback.call(enumerable, enumerable[i], i, enumerable);
}

function eachForIn(enumerable, callback, context) {
  for (var key in enumerable) {
    if (Object.prototype.hasOwnProperty.call(enumerable, key)) callback.call(context, enumerable[key], key, enumerable);
  }
}

function runBenchmarks() {
  var times = 100000,
      tests = [eachNative, eachNumerical, eachForIn],
      names = ['eachNative', 'eachNumerical', 'eachForIn'];

  for (var i = 0; i < tests.length; i++) {
    benchmark = Benchmark.run(times, function() {
      var a = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      tests[i](a, (function(number) {
        number + 1;
      }));
    });

    displayResults('Run with ' + names[i] + ':');
    displayResults(benchmark);
  }
}

Benchmark.go(runBenchmarks);
