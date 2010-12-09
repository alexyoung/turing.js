(function(global) {
  function turing() {
    return turing.init.apply(turing, arguments);
  }

  turing.VERSION = '0.0.35';
  turing.lesson = 'Part 35: More on Chained Events';
  turing.alias = '$t';

  turing.isArray = Array.isArray || function(object) {
    return !!(object && object.concat && object.unshift && !object.callee);
  };

  turing.toArray = function(collection) {
    var results = [];
    for (var i = 0; i < collection.length; i++) {
      results.push(collection[i]);
    }
    return results;
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

  var testCache = {},
      detectionTests = {};

  turing.addDetectionTest = function(name, fn) {
    if (!detectionTests[name])
      detectionTests[name] = fn;
  };

  turing.detect = function(testName) {
    if (typeof testCache[testCache] === 'undefined') {
      testCache[testName] = detectionTests[testName]();
    }
    return testCache[testName];
  };

  if (global.turing) {
    throw new Error('turing has already been defined');
  } else {
    global.turing = turing;
    if (typeof exports !== 'undefined') exports.turing = turing;
  }
})(typeof window === 'undefined' ? this : window);


