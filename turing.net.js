/*!
 * Turing Net
 * Copyright (C) 2010-2011 Alex R. Young
 * MIT Licensed
 */

/**
 * The Turing Net module (Ajax).
 */
(function() {
  var net = {};

  /**
    * Ajax request options:
    *
    *   - `method`: {String} HTTP method - GET, POST, etc.
    *   - `asynchronous`: {Boolean} Defaults to asynchronous
    *   - `postBody`: {String} The HTTP POST body
    *   - `success`: {Function} A callback to run when a request is successful
    *   - `error`: {Function} A callback to run when the request fails
    *
    */

  function xhr() {
    if (typeof XMLHttpRequest !== 'undefined' && (window.location.protocol !== 'file:' || !window.ActiveXObject)) {
      return new XMLHttpRequest();
    } else {
      try {
        return new ActiveXObject('Msxml2.XMLHTTP.6.0');
      } catch(e) { }
      try {
        return new ActiveXObject('Msxml2.XMLHTTP.3.0');
      } catch(e) { }
      try {
        return new ActiveXObject('Msxml2.XMLHTTP');
      } catch(e) { }
    }
    return false;
  }

  function successfulRequest(request) {
    return (request.status >= 200 && request.status < 300) ||
        request.status == 304 ||
        (request.status == 0 && request.responseText);
  }

  function ajax(url, options) {
    var request = xhr();

    function respondToReadyState(readyState) {
      if (request.readyState == 4) {
        if (successfulRequest(request)) {
          if (options.success) options.success(request);
        } else {
          if (options.error) options.error(request);
        }
      }
    }

    // The HTTP headers to accept
    function setHeaders() {
      var headers = {
        'Accept': 'text/javascript, text/html, application/xml, text/xml, */*'
      };

      /**
       * Set other headers
       */

      for (var name in headers) {
        request.setRequestHeader(name, headers[name]);
      }
    }

    if (typeof options === 'undefined') options = {};
    options.method = options.method ? options.method.toLowerCase() : 'get';
    options.asynchronous = options.asynchronous || true;
    options.postBody = options.postBody || '';

    request.onreadystatechange = respondToReadyState;
    request.open(options.method, url, options.asynchronous);
    setHeaders();

    try {
      request.send(options.postBody);
    } catch (e) {
      if (options.error) {
        options.error();
      }
    }

    return request;
  }

  function JSONPCallback(url, success, failure) {
    var self = this;
    this.url = url;
    this.methodName = '__turing_jsonp_' + parseInt(new Date().getTime());
    this.success = success;
    this.failure = failure;

    function runCallback(json) {
      self.success(json);
      self.teardown();
    }

    window[this.methodName] = runCallback;
  }

  JSONPCallback.prototype.run = function() {
    this.scriptTag = document.createElement('script');
    this.scriptTag.id = this.methodName;
    this.scriptTag.src = this.url.replace('{callback}', this.methodName);
    document.body.appendChild(this.scriptTag);
  }

  JSONPCallback.prototype.teardown = function() {
    window[this.methodName] = null;
    delete window[this.methodName];
    if (this.scriptTag) {
      document.body.removeChild(this.scriptTag);
    }
  }

  /**
   * An Ajax GET request.
   *
   * @param {String} url The URL to request
   * @param {Object} options The Ajax request options
   * @returns {Object} The Ajax request object
   */
  net.get = function(url, options) {
    options.method = 'get';
    return ajax(url, options);
  };

  /**
   * An Ajax POST request.
   *
   * @param {String} url The URL to request
   * @param {Object} options The Ajax request options (`postBody` may come in handy here)
   * @returns {Object} The Ajax request object
   */
  net.post = function(url, options) {
    options.method = 'post';
    return ajax(url, options);
  };

  /**
   * A jsonp request.  Example:
   *
   *     var url = 'http://feeds.delicious.com/v1/json/';
   *     url += 'alex_young/javascript?callback={callback}';
   *
   *     turing.net.jsonp(url, {
   *       success: function(json) {
   *         console.log(json);
   *       }
   *     });
   *
   * @param {String} url The URL to request
   * @param {Object} options The Ajax request options
   */
  net.jsonp = function(url, options) {
    if (typeof options === 'undefined') options = {};
    var callback = new JSONPCallback(url, options.success, options.failure);
    callback.run();
  };

  net.ajax = ajax;
  turing.net = net;
})();

