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
    *   - `success`: {Function} A callback to run when a request is successful
    *   - `error`: {Function} A callback to run when the request fails
    *   - `asynchronous`: {Boolean} Defaults to asynchronous
    *   - `postBody`: {String} The HTTP POST body
    *   - `contentType`: {String} The content type of the request, default is `application/x-www-form-urlencoded`
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

  /**
    * Serialize JavaScript for HTTP requests.
    *
    * @param {Object} object An Array or Object
    * @returns {String} A string suitable for a GET or POST request
    */
  net.serialize = function(object) {
    if (!object) return;

		var results = [];
    for (var key in object) {
      results.push(encodeURIComponent(key) + '=' + encodeURIComponent(object[key]));
    }
		return results.join('&');
  };

  /**
    * JSON.parse support can be inferred using `turing.detect('JSON.parse')`.
    */
  turing.addDetectionTest('JSON.parse', function() {
    return window.JSON && window.JSON.parse;
  });

  /**
    * Parses JSON represented as a string.
    *
    * @param {String} string The original string
    * @returns {Object} A JavaScript object
    */
  net.parseJSON = function(string) {
		if (typeof string !== 'string' || !string) return null;
		string = string.trim();
    return turing.detect('JSON.parse') ?
      window.JSON.parse(string) :
      (new Function('return ' + string))();
  };

  function ajax(url, options) {
    var request = xhr(),
        promise;
        
    if (turing.Promise) {
      promise = new turing.Promise();
    }

    function respondToReadyState(readyState) {
      if (request.readyState == 4) {
        if (request.getResponseHeader('content-type') === 'application/json')
          request.responseJSON = net.parseJSON(request.responseText);

        if (successfulRequest(request)) {
          if (options.success) options.success(request);
          if (promise) promise.resolve(request);
        } else {
          if (options.error) options.error(request);
          if (promise) promise.reject(request);
        }
      }
    }

    // Set the HTTP headers
    function setHeaders() {
      var defaults = {
        'Accept': 'text/javascript, application/json, text/html, application/xml, text/xml, */*',
        'Content-Type': 'application/x-www-form-urlencoded'
      };

      /**
       * Merge headers with defaults. 
       */
      for (var name in defaults) {
        if (!options.headers.hasOwnProperty(name))
          options.headers[name] = defaults[name];
      }

      for (var name in options.headers) {
        request.setRequestHeader(name, options.headers[name]);
      }
    }

    if (typeof options === 'undefined') options = {};

    options.method = options.method ? options.method.toLowerCase() : 'get';
    options.asynchronous = options.asynchronous || true;
    options.postBody = options.postBody || '';
    request.onreadystatechange = respondToReadyState;
    request.open(options.method, url, options.asynchronous);

    options.headers = options.headers || {};
    if (options.contentType) {
      options.headers['Content-Type'] = options.contentType;
    }

    if (typeof options.postBody !== 'string') {
      // Serialize JavaScript
      options.postBody = net.serialize(options.postBody);
    }

    setHeaders();

    try {
      request.send(options.postBody);
    } catch (e) {
      if (options.error) {
        options.error();
      }
    }

    request.then = function() {
      if (promise) promise.then.apply(promise, arguments);
    };

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
   *     turing.net.get('/url', {
   *       success: function(request) {
   *       }
   *     });
   *
   * @param {String} url The URL to request
   * @param {Object} options The Ajax request options
   * @returns {Object} The Ajax request object
   */
  net.get = function(url, options) {
    if (typeof options === 'undefined') options = {};
    options.method = 'get';
    return ajax(url, options);
  };

  /**
   * An Ajax POST request.
   *
   *
   *     turing.net.post('/url', {
   *       postBody: 'params',
   *       success: function(request) {
   *       }
   *     });
   *
   * @param {String} url The URL to request
   * @param {Object} options The Ajax request options (`postBody` may come in handy here)
   * @returns {Object} The Ajax request object
   */
  net.post = function(url, options) {
    if (typeof options === 'undefined') options = {};
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

  /**
    * The Ajax methods are mapped to the `turing` object:
    *
    *      turing.get();
    *      turing.post();
    *      turing.json();
    *
    */
  turing.get = net.get;
  turing.post = net.post;
  turing.jsonp = net.jsonp;

  net.ajax = ajax;
  turing.net = net;
})();

