turing.enumerable = {
  Break: {},

  each: function(enumerable, callback, context) {
    try {
      if (Array.prototype.forEach && enumerable.forEach === Array.prototype.forEach) {
        enumerable.forEach(callback, context);
      } else if (turing.isNumber(enumerable.length)) {
        for (var i = 0, l = enumerable.length; i < l; i++) callback.call(enumerable, enumerable[i], i, enumerable);
      } else {
        for (var key in enumerable) {
          if (hasOwnProperty.call(enumerable, key)) callback.call(context, enumerable[key], key, enumerable);
        }
      }
    } catch(e) {
      if (e != turing.enumerable.Break) throw e;
    }

    return enumerable;
  },

  map: function(enumerable, callback, context) {
    if (Array.prototype.map && enumerable.map === Array.prototype.map) return enumerable.map(callback, context);
    var results = [];
    turing.enumerable.each(enumerable, function(value, index, list) {
      results.push(callback.call(context, value, index, list));
    });
    return results;
  },

  filter: function(enumerable, callback, context) {
    if (Array.prototype.filter && enumerable.filter === Array.prototype.filter)
      return enumerable.filter(callback, context);
    var results   = [],
        pushIndex = !turing.isArray(enumerable);
    turing.enumerable.each(enumerable, function(value, index, list) {
      if (callback.call(context, value, index, list)) {
        if (pushIndex) {
          results.push([index, value]);
        } else {
          results.push(value);
        }
      }
    });
    return results;
  },

  reject: function(enumerable, callback, context) {
    return this.filter(enumerable, function() {
      return !callback.apply(context, arguments);
    }, context);
  },

  detect: function(enumerable, callback, context) {
    var result;
    turing.enumerable.each(enumerable, function(value, index, list) {
      if (callback.call(context, value, index, list)) {
        result = value;
        throw turing.enumerable.Break;
      }
    });
    return result;
  },

  reduce: function(enumerable, memo, callback, context) {
    if (Array.prototype.reduce && enumerable.reduce === Array.prototype.reduce)
      return enumerable.reduce(turing.bind(callback, context), memo);
    turing.enumerable.each(enumerable, function(value, index, list) {
      memo = callback.call(context, memo, value, index, list);
    });
    return memo;
  },

  tail: function(enumerable, start) {
    start = typeof start === 'undefined' ? 1 : start;
    return Array.prototype.slice.apply(enumerable, [start]);
  },

  invoke: function(enumerable, method) {
    var args = turing.enumerable.tail(arguments, 2); 
    return turing.enumerable.map(enumerable, function(value) {
      return (method ? value[method] : value).apply(value, args);
    });
  },

  pluck: function(enumerable, key) {
    return turing.enumerable.map(enumerable, function(value) {
      return value[key];
    });
  },

  some: function(enumerable, callback, context) {
    callback = callback || turing.enumerable.identity;
    if (Array.prototype.some && enumerable.some === Array.prototype.some)
      return enumerable.some(callback, context);
    var result = false;
    turing.enumerable.each(enumerable, function(value, index, list) {
      if (result = callback.call(context, value, index, list)) {
        throw turing.enumerable.Break;
      }
    });
    return result;
  },

  chain: function(enumerable) {
    return new turing.enumerable.Chainer(enumerable);
  },

  identity: function(value) {
    return value;
  }
};

// Aliases
turing.enumerable.select = turing.enumerable.filter;
turing.enumerable.collect = turing.enumerable.map;
turing.enumerable.inject = turing.enumerable.reduce;
turing.enumerable.rest = turing.enumerable.tail;
turing.enumerable.any = turing.enumerable.some;
turing.chainableMethods = ['map', 'collect', 'detect', 'filter', 'reduce',
                           'tail', 'rest', 'reject', 'pluck', 'any', 'some'];

// Chainer class
turing.enumerable.Chainer = turing.Class({
  initialize: function(values) {
    this.results = values;
  },

  values: function() {
    return this.results;
  }
});

turing.enumerable.each(turing.chainableMethods, function(methodName) {
  var method = turing.enumerable[methodName];
  turing.enumerable.Chainer.prototype[methodName] = function() {
    var args = Array.prototype.slice.call(arguments);
    args.unshift(this.results);
    this.results = method.apply(this, args);
    return this;
  }
});
