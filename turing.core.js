(function(global) {
  var turing = {
    VERSION: '0.0.5',
    lesson: 'Part 4: Functional Programming 2'
  };

  turing.isArray = Array.isArray || function(object) {
    return !!(object && object.concat && object.unshift && !object.callee);
  }

  turing.isNumber = function(object) {
    return (object === +object) || (toString.call(object) === '[object Number]');
  }

  if (global.turing) {
    throw new Error('turing has already been defined');
  } else {
    global.turing = turing;
  }
})(typeof window === 'undefined' ? this : window);
