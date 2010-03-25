turing.functional = {
  curry: function(fn) {
    var slice = Array.prototype.slice,
        args  = slice.apply(arguments, [1]);
    return function() {
      return fn.apply(null, args.concat(slice.apply(arguments)));
    };
  },

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
