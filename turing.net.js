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

  net.get = function(url, options) {
    options.method = 'get';
    return ajax(url, options);
  };

  net.post = function(url, options) {
    options.method = 'post';
    return ajax(url, options);
  };

  net.ajax = ajax;

  turing.net = net;
})();

