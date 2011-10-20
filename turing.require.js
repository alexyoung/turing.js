/*!
 * Turing Core
 * Copyright (C) 2011 Alex R. Young
 * MIT Licensed
 */

/**
 * Contains everything relating to the `require` module.
 */
(function(global) {
  var appendTo = document.head || document.getElementsByTagName('head'),
      scriptOptions = ['async', 'defer', 'src', 'text'];

  /**
   * Used to determine if a script is from the same origin.
   *
   * @param {String} Path to a script
   * @return {Boolean} True when `src` is from the same origin
   */
  function isSameOrigin(src) {
    return src.charAt(0) === '/'
      || src.indexOf(location.protocol + '//' + location.host) !== -1
      || false;
  }

  /**
   * Creates a script tag from a set of options.
   *
   * Options may include: `async`, `defer`, `src`, and `text`.
   *
   * @param {Object} The options
   * @return {Object} The script tag's DOM object
   */
  function createScript(options) {
    var script = document.createElement('script'),
        key;

    for (key in scriptOptions) {
      key = scriptOptions[key];

      if (options[key]) {
        script[key] = options[key];
      }
    }

    return script;
  }

  /**
   * Inserts a script tag into the document.
   *
   * @param {String} The script tag
   */
  function insertScript(script) {
    appendTo.insertBefore(script, appendTo.firstChild);
  }

  /**
   * Loads scripts using script tag insertion.
   *
   * @param {String} The script path
   * @param {Object} A configuration object
   * @param {Function} A callback
   */
  function requireWithScriptInsertion(scriptSrc, options, fn) {
    options.src = scriptSrc;
    var script = createScript(options);

    script.onload = script.onreadystatechange = function() {
      if (!script.readyState || (script.readyState === 'complete' || script.readyState === 'loaded')) {
        script.onload = script.onreadystatechange = null;
        fn();
        appendTo.removeChild(script);
      }
    };

    insertScript(script, options, fn);
  }

  /**
   * Loads scripts using XMLHttpRequest.
   *
   * @param {String} The script path
   * @param {Object} A configuration object
   * @param {Function} A callback
   */
  function requireWithXMLHttpRequest(scriptSrc, options, fn) {
    if (!isSameOrigin(scriptSrc)) {
      throw('Scripts loaded with XMLHttpRequest must be from the same origin');
    }

    if (!turing.get) {
      throw('Loading scripts with XMLHttpRequest requires turing.net to be loaded');
    }

    turing
      .get(scriptSrc)
      .end(function(res) {
        options.text = res.responseText;
        
        var script = createScript(options);
        insertScript(script);
        appendTo.removeChild(script);
        fn();
      });
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

      switch (options.transport) {
        case 'XMLHttpRequest':
          return requireWithXMLHttpRequest(scriptSrc, options, fn);

        case 'scriptInsertion':
          return requireWithScriptInsertion(scriptSrc, options, fn);

        default:
          return requireWithScriptInsertion(scriptSrc, options, fn);
      }
    });
  };

  turing.require.isSameOrigin = isSameOrigin;
}(window));
