(function(global) {
  var turing = {
    VERSION: '0.0.4',
    lesson: 'Part 4: Functional Programming'
  };

  if (global.turing) {
    throw new Error('turing has already been defined');
  } else {
    global.turing = turing;
  }
})(typeof window === 'undefined' ? this : window);
