(function(global) {
  var appendTo = document.head || document.getElementsByTagName('head');

  /**
   * Non-blocking script loading.
   *
   * @param {String} The script path
   * @param {Function} A callback to run once the script has loaded
   */
  function require(scriptSrc, fn) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = scriptSrc;

    script.onload = script.onreadystatechange = function() {
      if (!script.readyState || (script.readyState === 'complete' || script.readyState === 'loaded')) {
        script.onload = script.onreadystatechange = null;
        fn();
        appendTo.removeChild(script);
      }
    };

    appendTo.insertBefore(script, appendTo.firstChild);
  }

  turing.require = function(scriptSrc, fn) {
    setTimeout(function() {
      if ('item' in appendTo) {
        if (!appendTo[0]) {
          return setTimeout(arguments.callee, 25);
        }

        appendTo = appendTo[0];
      }

      require(scriptSrc, fn);
    });
  };
}(window));
