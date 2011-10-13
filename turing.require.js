(function(global) {
  var appendTo = document.head || document.getElementsByTagName('head');

  function require(scriptSrc, options, fn) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = scriptSrc;

    if (options.async) {
      script.async = options.async;
    }

    if (options.defer) {
      script.defer = options.defer;
    }

    script.onload = script.onreadystatechange = function() {
      if (!script.readyState || (script.readyState === 'complete' || script.readyState === 'loaded')) {
        script.onload = script.onreadystatechange = null;
        fn();
        appendTo.removeChild(script);
      }
    };

    appendTo.insertBefore(script, appendTo.firstChild);
  }

  /**
   * Non-blocking script loading.
   *
   * @param {String} The script path
   * @param {Object} A configuration object.  Options: {Boolean} `defer`, {Boolean} `async`
   * @param {Function} A callback
   */
  turing.require = function(scriptSrc, options, fn) {
    options = options || {};
    fn = fn || function() {};

    setTimeout(function() {
      if ('item' in appendTo) {
        if (!appendTo[0]) {
          return setTimeout(arguments.callee, 25);
        }

        appendTo = appendTo[0];
      }

      require(scriptSrc, options, fn);
    });
  };
}(window));
