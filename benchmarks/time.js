load('benchmark.js');

function runBenchmarks() {
  var times = 1000000;

  benchmark = Benchmark.run(times, function() {
    var i = (new Date()).getTime();
  });

  displayResults('Run with getTime:');
  displayResults(benchmark);

  benchmark = Benchmark.run(times, function() {
    var i = (new Date()).valueOf();
  });

  displayResults('Run with getValue:');
  displayResults(benchmark);
}

Benchmark.go(runBenchmarks);
