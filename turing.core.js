(function(global) {
  var turing = {
    VERSION: '0.0.2',
    lesson: 'Part 2: Object Oriented Programming'
  };

  if (global.turing) {
    throw new Error('turing has already been defined');
  } else {
    global.turing = turing;
  }
})(typeof window === 'undefined' ? this : window);
