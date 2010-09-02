(function(global) {
  function turing() {
    return turing.init.apply(turing, arguments);
  }

  turing.VERSION = '0.0.28';
  turing.lesson = 'Part 28: Chaining';
  turing.alias = '$t';

  turing.isArray = Array.isArray || function(object) {
    return !!(object && object.concat && object.unshift && !object.callee);
  };

  // This can be overriden by libraries that extend turing(...)
  turing.init = function() { };

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

  turing.exportAlias = function(aliasName, method) {
    global[aliasName] = method();
  };

  if (global.turing) {
    throw new Error('turing has already been defined');
  } else {
    global.turing = turing;
  }
})(typeof window === 'undefined' ? this : window);
