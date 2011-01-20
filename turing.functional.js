/*!
 * Turing Functional
 * Copyright (C) 2010-2011 Alex R. Young
 * MIT Licensed
 */

/**
 * Turing Functional helpers.
 */
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
