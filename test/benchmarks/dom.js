var suite = new Benchmark.Suite,
    div = $t('#test-div')[0],
    cache = {};

function log(text) {
  $t('#results').append('<li>' + text + '</li>');
}

function hasClassRegExp(element, className) {
  if (element.className && element.className.length) {
    return new RegExp('(^|\\s)' + className + '($|\\s)').test(element.className);
  } else {
    return false;
  }
};

function hasClassCachedRegExp(element, className) {
  if (!cache[className]) {
    cache[className] = new RegExp('(^|\\s)' + className + '($|\\s)');
  }
  if (element.className && element.className.length) {
    return cache[className].test(element.className);
  } else {
    return false;
  }
};

suite.add('hasClassRegExp', function() {
  hasClassRegExp(div, 'example1');
  hasClassRegExp(div, 'unknown');
})
.add('hasClassCachedRegExp', function() {
  hasClassCachedRegExp(div, 'example1');
  hasClassCachedRegExp(div, 'unknown');
})
.add('built-in', function() {
  turing.dom.hasClass(div, 'example1');
  turing.dom.hasClass(div, 'unknown');
})
.on('cycle', function(event, bench) {
  log(String(bench));
})
.on('complete', function() {
  log('Fastest is ' + this.filter('fastest').pluck('name'));
  $t('#notice').text('Done');
})
.run(true);
