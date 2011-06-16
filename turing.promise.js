/*!
 * Turing Promise
 * Copyright (C) 2010-2011 Alex R. Young
 * MIT Licensed
 */

/**
 * The Turing Promise module.
 */
(function() {
  /**
   * The Promise class.
   */
  function Promise() {
    var self = this;
    this.pending = [];

    /**
     * Resolves a promise.
     *
     * @param {Object} A value
     */
    this.resolve = function(result) {
      self.complete('resolve', result);
    },

    /**
     * Rejects a promise.
     *
     * @param {Object} A value
     */
    this.reject = function(result) {
      self.complete('reject', result);
    }
  }

  Promise.prototype = {
    /**
     * Adds a success and failure handler for completion of this Promise object.
     *
     * @param {Function} success The success handler 
     * @param {Function} success The failure handler
     * @returns {Promise} `this`
     */
    then: function(success, failure) {
      this.pending.push({ resolve: success, reject: failure });
      return this;
    },

    /**
     * Runs through each pending 'thenable' based on type (resolve, reject).
     *
     * @param {String} type The thenable type
     * @param {Object} result A value
     */
    complete: function(type, result) {
      while (this.pending[0]) {
        this.pending.shift()[type](result);
      }
    }
  };

  /**
    * Chained Promises:
    *
    *     turing().delay(1000).then(function() {
    *       assert.ok((new Date()).valueOf() - start >= 1000);  
    *     });
    *
    */
  var chain = {};

  turing.init(function() {
    if (arguments.length === 0)
      return chain;
  });

  chain.delay = function(ms) {
    var p = new turing.Promise();
    setTimeout(p.resolve, ms);
    return p;
  };

  turing.Promise = Promise;
})();

