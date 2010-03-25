Benchmark = {
  results: [],

  addResult: function(start, end) {
    this.results.push(end - start);
  },

  displayResults: function() {
    var total   = 0,
        seconds = 0,
        i       = 0;
    for (i = 0; i < this.results.length; i++) {
      total += this.results[i];
    }
    seconds = total / 1000;
    return 'Elapsed time: ' + total + 'ms (' + seconds + ' seconds)';
  },

  run: function(times, callback) {
    this.results = [];
    for (var i = 0; i < times; i++) {
      var start = new Date(),
          end   = null;
      callback();
      end = new Date();
      this.addResult(start, end);
    }
    return this.displayResults();
  },

  go: function(callback) {
    // If there's no window, set things up for rhino/node
    if (typeof window === 'undefined') {
      // For node
      if (typeof require != 'undefined') {
        sys = require('sys');
        displayResults = sys.puts;
      } else {
        displayResults = print;
      }
      callback();
    } else {
      displayResults = function(result) {
        var element = document.getElementById('results');
        element.innerHTML = element.innerHTML + '<p>' + result + '</p>';
      }
    }
  }
};

