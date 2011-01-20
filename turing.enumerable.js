/*!
 * Turing Enumerable
 * Copyright (C) 2010-2011 Alex R. Young
 * MIT Licensed
 */

/**
 * The Turing Enumerable module.
 */
turing.enumerable = {
  /**
   * Throw to break out of iterators.
   */
  Break: {},

  /**
   * Iterates using a function over a set of items.  Example:
   *
   *      turing.enumerable.each([1, 2, 3], function(n) {
   *        console.log(n);
   *      });
   *
   * @param {Object} enumerable A set of items that responds to `length`
   * @param {Function} callback The function to run
   * @param {Object} [context] An optional parameter to determine `this` in the callback
   * @returns {Object} The passed in enumerable object
   */
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

  /**
   * Changes a set of item using a function. Example:
   *
   *      turing.enumerable.map([1, 2, 3], function(n) {
   *        return n + 1;
   *      });
   *
   * @param {Object} enumerable A set of items that responds to `length`
   * @param {Function} callback The function to run over each item
   * @param {Object} [context] An optional parameter to determine `this` in the callback
   * @returns {Array} The changed items
   */
  map: function(enumerable, callback, context) {
    if (Array.prototype.map && enumerable.map === Array.prototype.map) return enumerable.map(callback, context);
    var results = [];
    turing.enumerable.each(enumerable, function(value, index, list) {
      results.push(callback.call(context, value, index, list));
    });
    return results;
  },

  /**
   * Removes items based on a callback.  For example:
   *
   *      var a = [1, 2, 3, 4, 5, 6, 7, 8];
   *      turing.enumerable.filter(a, function(n) {
   *        return n % 2 === 0;
   *      });
   *
   *      => [2, 4, 6, 8]
   *
   * @param {Object} enumerable A set of items that responds to `length`
   * @param {Function} callback The function to run over each item
   * @param {Object} [context] An optional parameter to determine `this` in the callback
   * @returns {Array} The filtered items
   */
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

  /**
   * The opposite of filter.  For example:
   *
   *      var a = [1, 2, 3, 4, 5, 6, 7, 8];
   *      turing.enumerable.reject(a, function(n) {
   *        return n % 2 === 0;
   *      });
   *
   *      => [1, 3, 5, 7]
   *
   * @param {Object} enumerable A set of items that responds to `length`
   * @param {Function} callback The function to run over each item
   * @param {Object} [context] An optional parameter to determine `this` in the callback
   * @returns {Array} The rejected items
   */
  reject: function(enumerable, callback, context) {
    return this.filter(enumerable, function() {
      return !callback.apply(context, arguments);
    }, context);
  },

  /**
   * Find a single item.  For example:
   *
   *      var a = [1, 2, 3, 4, 5, 6, 7, 8];
   *      turing.enumerable.detect(a, function(n) {
   *        return n === 3;
   *      });
   *
   *      => 3
   *
   * @param {Object} enumerable A set of items that responds to `length`
   * @param {Function} callback The function to run over each item
   * @param {Object} [context] An optional parameter to determine `this` in the callback
   * @returns {Object} The item, if found
   */
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

  /**
   * Runs a function over each item, collecting the results:
   *
   *      var a = [1, 2, 3, 4, 5, 6, 7, 8];
   *      turing.enumerable.reduce(a, 0, function(memo, n) {
   *        return memo + n;
   *      });
   *
   *      => 36
   *
   * @param {Object} enumerable A set of items that responds to `length`
   * @param {Object} memo The initial accumulator value
   * @param {Function} callback The function to run over each item
   * @param {Object} [context] An optional parameter to determine `this` in the callback
   * @returns {Object} The accumulated results
   */
  reduce: function(enumerable, memo, callback, context) {
    if (Array.prototype.reduce && enumerable.reduce === Array.prototype.reduce)
      return enumerable.reduce(turing.bind(callback, context), memo);
    turing.enumerable.each(enumerable, function(value, index, list) {
      memo = callback.call(context, memo, value, index, list);
    });
    return memo;
  },

  /**
   * Flattens multidimensional arrays:
   *
   *      turing.enumerable.flatten([[2, 4], [[6], 8]]);
   *
   *      => [2, 4, 6, 8]
   *
   * @param {Object} enumerable A set of items that responds to `length`
   * @returns {Object} The flat array
   */
  flatten: function(array) {
    return turing.enumerable.reduce(array, [], function(memo, value) {
      if (turing.isArray(value)) return memo.concat(turing.enumerable.flatten(value));
      memo.push(value);
      return memo;
    });
  },

  /**
   * Return the last items from a list:
   *
   *      turing.enumerable.tail([1, 2, 3, 4, 5], 3);
   *
   *      => [4, 5]
   *
   * @param {Object} enumerable A set of items that responds to `length`
   * @param {Number} start The index of the item to 'cut' the array
   * @returns {Object} A list of items
   */
  tail: function(enumerable, start) {
    start = typeof start === 'undefined' ? 1 : start;
    return Array.prototype.slice.apply(enumerable, [start]);
  },

  /**
   * Invokes `method` on a list of items:
   *
   *      turing.enumerable.invoke(['hello', 'world'], 'substring', 0, 3);
   *
   *      => ['hel', 'wor']
   *
   * @param {Object} enumerable A set of items that responds to `length`
   * @param {Function} method The method to invoke on each item
   * @returns {Object} The changed list
   */
  invoke: function(enumerable, method) {
    var args = turing.enumerable.tail(arguments, 2); 
    return turing.enumerable.map(enumerable, function(value) {
      return (method ? value[method] : value).apply(value, args);
    });
  },

  /**
   * Pluck a property from each item of a list:
   *
   *      turing.enumerable.pluck(['hello', 'world'], 'length');
   *
   *      => [5, 5]
   *
   * @param {Object} enumerable A set of items that responds to `length`
   * @param {String} key The property to pluck
   * @returns {Object} The plucked properties
   */
  pluck: function(enumerable, key) {
    return turing.enumerable.map(enumerable, function(value) {
      return value[key];
    });
  },

  /**
   * Determines if a list matches some items based on a callback:
   *
   *      turing.enumerable.some([1, 2, 3], function(value) {
   *        return value === 3;
   *      });
   *
   *      => true
   *
   * @param {Object} enumerable A set of items that responds to `length`
   * @param {Function} callback A function to run against each item
   * @param {Object} [context] An optional parameter to determine `this` in the callback
   * @returns {Boolean} True if an item was matched
   */
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

  /**
   * Checks if all items match the callback:
   *
   *      turing.enumerable.all([1, 2, 3], function(value) {
   *        return value < 4;
   *      })
   *
   *      => true
   *
   * @param {Object} enumerable A set of items that responds to `length`
   * @param {Function} callback A function to run against each item
   * @param {Object} [context] An optional parameter to determine `this` in the callback
   * @returns {Boolean} True if all items match
   */
  all: function(enumerable, callback, context) {
    callback = callback || turing.enumerable.identity;
    if (Array.prototype.every && enumerable.every === Array.prototype.every)
      return enumerable.every(callback, context);
    var result = true;
    turing.enumerable.each(enumerable, function(value, index, list) {
      if (!(result = result && callback.call(context, value, index, list))) {
        throw turing.enumerable.Break;
      }
    });
    return result;
  },

  /**
   * Checks if one item matches a value:
   *
   *      turing.enumerable.include([1, 2, 3], 3);
   *
   *      => true
   *
   * @param {Object} enumerable A set of items that responds to `length`
   * @param {Object} target A value to find
   * @returns {Boolean} True if an item was found
   */
  include: function(enumerable, target) {
    if (Array.prototype.indexOf && enumerable.indexOf === Array.prototype.indexOf)
      return enumerable.indexOf(target) != -1;
    var found = false;
    turing.enumerable.each(enumerable, function(value, key) {
      if (found = value === target) {
        throw turing.enumerable.Break;
      }
    });
    return found;
  },

  /**
   * Chain enumerable calls:
   *
   *      turing.enumerable.chain([1, 2, 3, 4])
   *        .filter(function(n) { return n % 2 == 0; })
   *        .map(function(n) { return n * 10; })
   *        .values();
   *
   *      => [20, 40]
   *
   * @param {Object} enumerable A set of items that responds to `length`
   * @returns {Object} The chained enumerable API
   */
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
turing.enumerable.every = turing.enumerable.all;
turing.chainableMethods = ['map', 'collect', 'detect', 'filter', 'reduce',
                           'tail', 'rest', 'reject', 'pluck', 'any', 'some'];

// Chainer class
turing.enumerable.Chainer = function(values) {
  this.results = values;
};

turing.enumerable.Chainer.prototype.values = function() {
  return this.results;
};

turing.enumerable.each(turing.chainableMethods, function(methodName) {
  var method = turing.enumerable[methodName];
  turing.enumerable.Chainer.prototype[methodName] = function() {
    var args = Array.prototype.slice.call(arguments);
    args.unshift(this.results);
    this.results = method.apply(this, args);
    return this;
  }
});
