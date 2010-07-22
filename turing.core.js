(function(global) {
  var turing = {
    VERSION: '0.0.22',
    lesson: 'Part 22: Animations',
    alias: '$t'
  };

  turing.isArray = Array.isArray || function(object) {
    return !!(object && object.concat && object.unshift && !object.callee);
  };

  turing.isNumber = function(object) {
    return (object === +object) || (toString.call(object) === '[object Number]');
  };

  turing.bind = function(fn, object) {
    var slice = Array.prototype.slice,
        args  = slice.apply(arguments, [2]);
    return function() {
      return fn.apply(object || {}, args.concat(slice.apply(arguments)));
    };
  };

  if (global.turing) {
    throw new Error('turing has already been defined');
  } else {
    global.turing = turing;
  }
})(typeof window === 'undefined' ? this : window);
