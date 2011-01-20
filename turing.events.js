/*!
 * Turing Events
 * Copyright (C) 2010-2011 Alex R. Young
 * MIT Licensed
 */

/**
 * The Turing Events module.
 */
(function() {
  var events = {}, cache = [], onReadyBound = false, isReady = false, DOMContentLoaded, readyCallbacks = [];

  function isValidElement(element) {
    return element.nodeType !== 3 && element.nodeType !== 8;
  }

  function stop(event) {
    event.preventDefault(event);
    event.stopPropagation(event);
  }

  function fix(event, element) {
    if (!event) var event = window.event;

    event.stop = function() { stop(event); };

    if (typeof event.target === 'undefined')
      event.target = event.srcElement || element;

    if (!event.preventDefault)
      event.preventDefault = function() { event.returnValue = false; };

    if (!event.stopPropagation)
      event.stopPropagation = function() { event.cancelBubble = true; };

    if (event.target && event.target.nodeType === 3)
      event.target = event.target.parentNode;

    if (event.pageX == null && event.clientX != null) {
      var doc = document.documentElement, body = document.body;
      event.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
      event.pageY = event.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0);
    }

    return event;
  }

  function createResponder(element, handler) {
    return function(event) {
      fix(event, element);
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

  function ready() {
    if (!isReady) {
			// Make sure body exists
			if (!document.body) {
				return setTimeout(ready, 13);
			}

      isReady = true;

      for (var i in readyCallbacks) {
        readyCallbacks[i]();
      }

      readyCallbacks = null;

      // TODO:
      // When custom events work properly in IE:
      // events.fire(document, 'dom:ready');
    }
  }

  // This checks if the DOM is ready recursively
  function DOMReadyScrollCheck() {
    if (isReady) {
      return;
    }

    try {
      document.documentElement.doScroll('left');
    } catch(e) {
      setTimeout(DOMReadyScrollCheck, 1);
      return;
    }

    ready();
  }

  // DOMContentLoaded cleans up listeners
  if (document.addEventListener) {
    DOMContentLoaded = function() {
      document.removeEventListener('DOMContentLoaded', DOMContentLoaded, false);
      ready();
    };
  } else if ( document.attachEvent ) {
    DOMContentLoaded = function() {
      if (document.readyState === 'complete') {
        document.detachEvent('onreadystatechange', DOMContentLoaded);
        ready();
      }
    };
  }

  function bindOnReady() {
    if (onReadyBound) return;
    onReadyBound = true;

		if (document.readyState === 'complete') {
			ready();
		} else if (document.addEventListener) {
			document.addEventListener('DOMContentLoaded', DOMContentLoaded, false );
			window.addEventListener('load', ready, false);
		} else if (document.attachEvent) {
			document.attachEvent('onreadystatechange', DOMContentLoaded);

			window.attachEvent('onload', ready);

			// Check to see if the document is ready
			var toplevel = false;
			try {
				toplevel = window.frameElement == null;
			} catch(e) {}

			if (document.documentElement.doScroll && toplevel) {
				DOMReadyScrollCheck();
			}
		}
  }

  function IEType(type) {
    if (type.match(/:/)) {
      return type;
    }
    return 'on' + type;
  }

  events.add = function(element, type, handler) {
    if (!isValidElement(element)) return;

    var responder = createResponder(element, handler);
    cache.push({ element: element, type: type, handler: handler, responder: responder });

    if (type.match(/:/) && element.attachEvent) {
      element.attachEvent('ondataavailable', responder);
    } else {
      if (element.addEventListener) {
        element.addEventListener(type, responder, false);
      } else if (element.attachEvent) {
        element.attachEvent(IEType(type), responder);
      }
    }
  };

  events.remove = function(element, type, handler) {
    if (!isValidElement(element)) return;
    var responder = removeCachedResponder(element, type, handler);

    if (document.removeEventListener) {
      element.removeEventListener(type, responder, false);
    } else {
      element.detachEvent(IEType(type), responder);
    }
  };

  events.fire = function(element, type) {
    var event;
    if (document.createEventObject) {
      event = document.createEventObject();
      fix(event, element);

      // This isn't quite ready
      if (type.match(/:/)) {
        event.eventName = type;
        event.eventType = 'ondataavailable';
        return element.fireEvent(event.eventType, event)
      } else {
        return element.fireEvent(IEType(type), event)
      }
    } else {
      event = document.createEvent('HTMLEvents');
      fix(event, element);
      event.eventName = type;
      event.initEvent(type, true, true);
      return !element.dispatchEvent(event);
    }
  };

  events.ready = function(callback) {
    bindOnReady();
    readyCallbacks.push(callback);
  };

  if (turing.dom !== 'undefined') {
    events.delegate = function(element, selector, type, handler) {
      return events.add(element, type, function(event) {
        var matches = turing.dom.findElement(event.target, selector, event.currentTarget);
        if (matches) {
          handler(event);
        }
      });
    };
  }

  events.addDOMethods = function() {
    if (typeof turing.domChain === 'undefined') return;

    turing.domChain.bind = function(type, handler) {
      var element = this.first();
      for (var i = 0; i < this.length; i++) {
        element = this[i];
        if (handler) {
          turing.events.add(element, type, handler);
        } else {
          turing.events.fire(element, type);
        }
      }
      return this;
    };

    var chainedAliases = ('click dblclick mouseover mouseout mousemove ' +
                          'mousedown mouseup blur focus change keydown ' +
                          'keypress keyup resize scroll').split(' ');

    for (var i = 0; i < chainedAliases.length; i++) {
      (function(name) {
        turing.domChain[name] = function(handler) {
          return this.bind(name, handler);
        };
      })(chainedAliases[i]);
    }
  };

  events.addDOMethods();

  turing.events = events;

  if (typeof window !== 'undefined' && window.attachEvent && !window.addEventListener) {
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

