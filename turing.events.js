(function() {
  var events = {}, cache = [];

  function isValidElement(element) {
    return element.nodeType !== 3 && element.nodeType !== 8;
  }

  function createResponder(element, handler) {
    return function(event) {
      if (typeof event.target === 'undefined') {
        event.target = event.srcElement || element;
      }

      return handler(event);
    };
  }

  function removeCachedResponder(element, type, handler) {
    var i = 0, responder, j = 0;
    for (j = 0; j < cache.length; j++) {
      if (cache[j].element !== element
          && cache[j].type !== type
          && cache[j].handler !== handler) {
        cache[i++] = cache[j];
      } else {
        responder = cache[j].responder;
      }
    }
    cache.length = i;
    return responder;
  }

  events.add = function(element, type, handler) {
    if (!isValidElement(element)) return;

    var responder = createResponder(element, handler);
    cache.push({ element: element, type: type, handler: handler, responder: responder });

    if (element.addEventListener) {
      element.addEventListener(type, responder, false);
    } else if (element.attachEvent) {
      element.attachEvent('on' + type, responder);
    }
  };

  events.remove = function(element, type, handler) {
    if (!isValidElement(element)) return;
    var responder = removeCachedResponder(element, type, handler);

    if (document.removeEventListener) {
      element.removeEventListener(type, responder, false);
    } else {
      element.detachEvent('on' + type, responder);
    }
  };

  events.fire = function(element, type) {
    var event;
    if (document.createEventObject) {
      event = document.createEventObject();
      return element.fireEvent('on' + type, event)
    } else {
      event = document.createEvent('HTMLEvents');
      event.initEvent(type, true, true);
      return !element.dispatchEvent(event);
    }
  };

  turing.events = events;

  if (window.attachEvent && !window.addEventListener) {
    window.attachEvent('onunload', function() {
      for (var i = 0; i < cache.length; i++) {
        try {
          events.remove(cache[i].element, cache[i].type);
          cache[i] = null;
        } catch(e) {}
      }
    });
  }
})();

