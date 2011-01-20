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
          if (options.success) {
            options.success(request);
          }
        } else {
          if (options.error) {
            options.error(request);
          }
        }
      }
    }

    function setHeaders() {
      var headers = {
        'Accept': 'text/javascript, text/html, application/xml, text/xml, */*'
      };

      for (var name in headers) {
        request.setRequestHeader(name, headers[name]);
      }
    }

    if (typeof options === 'undefined') {
      options = {};
    }

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

  net.get = function(url, options) {
    options.method = 'get';
    return ajax(url, options);
  };

  net.post = function(url, options) {
    options.method = 'post';
    return ajax(url, options);
  };

  net.jsonp = function(url, options) {
    if (typeof options === 'undefined') {
      options = {};
    }

    var callback = new JSONPCallback(url, options.success, options.failure);
    callback.run();
  };

  net.ajax = ajax;

  turing.net = net;
})();

