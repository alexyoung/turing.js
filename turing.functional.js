/*!
 * Turing Functional
 * Copyright (C) 2010-2011 Alex R. Young
 * MIT Licensed
 */

/**
 * Turing Functional helpers.
 */
define('turing.functional', ['turing.core'], function(turing) {
  turing.functional = {
    curry: turing.bind,

    memoize: function(memo, fn) {
      var wrapper = function(n) {
        var result = memo[n];
        if (typeof result !== 'number') {
          result = fn(wrapper, n);
          memo[n] = result;
        }
        return result;
      };
      return wrapper;
    } 
  };
  return turing;
});
