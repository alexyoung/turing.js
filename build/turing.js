(function(global) {
  var turing = {
    VERSION: '0.0.19',
    lesson: 'Part 19: Animations',
    alias: '$t'
  };

  turing.isArray = Array.isArray || function(object) {
    return !!(object && object.concat && object.unshift && !object.callee);
  };

  turing.isNumber = function(object) {
    return (object === +object) || (toString.call(object) === '[object Number]');
  };

  turing.bind = function(fn, object) {
    var slice = Array.prototype.slice,
        args  = slice.apply(arguments, [2]);
    return function() {
      return fn.apply(object || {}, args.concat(slice.apply(arguments)));
    };
  };

  if (global.turing) {
    throw new Error('turing has already been defined');
  } else {
    global.turing = turing;
  }
})(typeof window === 'undefined' ? this : window);
turing.Class = function() {
  return turing.oo.create.apply(this, arguments);
}

turing.oo = {
  create: function() {
    var methods = null,
        parent  = undefined,
        klass   = function() {
          this.$super = function(method, args) { return turing.oo.$super(this.$parent, this, method, args); };
          this.initialize.apply(this, arguments);
        };

    if (typeof arguments[0] === 'function') {
      parent = arguments[0];
      methods = arguments[1];
    } else {
      methods = arguments[0];
    }

    if (typeof parent !== 'undefined') {
      turing.oo.extend(klass.prototype, parent.prototype);
      klass.prototype.$parent = parent.prototype;
    }

    turing.oo.mixin(klass, methods);
    turing.oo.extend(klass.prototype, methods);
    klass.prototype.constructor = klass;

    if (!klass.prototype.initialize)
      klass.prototype.initialize = function(){};

    return klass;
  },

  mixin: function(klass, methods) {
    if (typeof methods.include !== 'undefined') {
      if (typeof methods.include === 'function') {
        turing.oo.extend(klass.prototype, methods.include.prototype);
      } else {
        for (var i = 0; i < methods.include.length; i++) {
          turing.oo.extend(klass.prototype, methods.include[i].prototype);
        }
      }
    }
  },

  extend: function(destination, source) {
    for (var property in source)
      destination[property] = source[property];
    return destination;
  },

  $super: function(parentClass, instance, method, args) {
    return parentClass[method].apply(instance, args);
  }
};
turing.enumerable = {
  Break: {},

  each: function(enumerable, callback, context) {
    try {
      if (Array.prototype.forEach && enumerable.forEach === Array.prototype.forEach) {
        enumerable.forEach(callback, context);
      } else if (turing.isNumber(enumerable.length)) {
        for (var i = 0, l = enumerable.length; i < l; i++) callback.call(enumerable, enumerable[i], i, enumerable);
      } else {
        for (var key in enumerable) {
          if (hasOwnProperty.call(enumerable, key)) callback.call(context, enumerable[key], key, enumerable);
        }
      }
    } catch(e) {
      if (e != turing.enumerable.Break) throw e;
    }

    return enumerable;
  },

  map: function(enumerable, callback, context) {
    if (Array.prototype.map && enumerable.map === Array.prototype.map) return enumerable.map(callback, context);
    var results = [];
    turing.enumerable.each(enumerable, function(value, index, list) {
      results.push(callback.call(context, value, index, list));
    });
    return results;
  },

  filter: function(enumerable, callback, context) {
    if (Array.prototype.filter && enumerable.filter === Array.prototype.filter)
      return enumerable.filter(callback, context);
    var results   = [],
        pushIndex = !turing.isArray(enumerable);
    turing.enumerable.each(enumerable, function(value, index, list) {
      if (callback.call(context, value, index, list)) {
        if (pushIndex) {
          results.push([index, value]);
        } else {
          results.push(value);
        }
      }
    });
    return results;
  },

  reject: function(enumerable, callback, context) {
    return this.filter(enumerable, function() {
      return !callback.apply(context, arguments);
    }, context);
  },

  detect: function(enumerable, callback, context) {
    var result;
    turing.enumerable.each(enumerable, function(value, index, list) {
      if (callback.call(context, value, index, list)) {
        result = value;
        throw turing.enumerable.Break;
      }
    });
    return result;
  },

  reduce: function(enumerable, memo, callback, context) {
    if (Array.prototype.reduce && enumerable.reduce === Array.prototype.reduce)
      return enumerable.reduce(turing.bind(callback, context), memo);
    turing.enumerable.each(enumerable, function(value, index, list) {
      memo = callback.call(context, memo, value, index, list);
    });
    return memo;
  },

  flatten: function(array) {
    return turing.enumerable.reduce(array, [], function(memo, value) {
      if (turing.isArray(value)) return memo.concat(turing.enumerable.flatten(value));
      memo.push(value);
      return memo;
    });
  },

  tail: function(enumerable, start) {
    start = typeof start === 'undefined' ? 1 : start;
    return Array.prototype.slice.apply(enumerable, [start]);
  },

  invoke: function(enumerable, method) {
    var args = turing.enumerable.tail(arguments, 2); 
    return turing.enumerable.map(enumerable, function(value) {
      return (method ? value[method] : value).apply(value, args);
    });
  },

  pluck: function(enumerable, key) {
    return turing.enumerable.map(enumerable, function(value) {
      return value[key];
    });
  },

  some: function(enumerable, callback, context) {
    callback = callback || turing.enumerable.identity;
    if (Array.prototype.some && enumerable.some === Array.prototype.some)
      return enumerable.some(callback, context);
    var result = false;
    turing.enumerable.each(enumerable, function(value, index, list) {
      if (result = callback.call(context, value, index, list)) {
        throw turing.enumerable.Break;
      }
    });
    return result;
  },

  all: function(enumerable, callback, context) {
    callback = callback || turing.enumerable.identity;
    if (Array.prototype.every && enumerable.every === Array.prototype.every)
      return enumerable.every(callback, context);
    var result = true;
    turing.enumerable.each(enumerable, function(value, index, list) {
      if (!(result = result && callback.call(context, value, index, list))) {
        throw turing.enumerable.Break;
      }
    });
    return result;
  },

  include: function(enumerable, target) {
    if (Array.prototype.indexOf && enumerable.indexOf === Array.prototype.indexOf)
      return enumerable.indexOf(target) != -1;
    var found = false;
    turing.enumerable.each(enumerable, function(value, key) {
      if (found = value === target) {
        throw turing.enumerable.Break;
      }
    });
    return found;
  },

  chain: function(enumerable) {
    return new turing.enumerable.Chainer(enumerable);
  },

  identity: function(value) {
    return value;
  }
};

// Aliases
turing.enumerable.select = turing.enumerable.filter;
turing.enumerable.collect = turing.enumerable.map;
turing.enumerable.inject = turing.enumerable.reduce;
turing.enumerable.rest = turing.enumerable.tail;
turing.enumerable.any = turing.enumerable.some;
turing.enumerable.every = turing.enumerable.all;
turing.chainableMethods = ['map', 'collect', 'detect', 'filter', 'reduce',
                           'tail', 'rest', 'reject', 'pluck', 'any', 'some'];

// Chainer class
turing.enumerable.Chainer = function(values) {
  this.results = values;
};

turing.enumerable.Chainer.prototype.values = function() {
  return this.results;
};

turing.enumerable.each(turing.chainableMethods, function(methodName) {
  var method = turing.enumerable[methodName];
  turing.enumerable.Chainer.prototype[methodName] = function() {
    var args = Array.prototype.slice.call(arguments);
    args.unshift(this.results);
    this.results = method.apply(this, args);
    return this;
  }
});
turing.functional = {
  curry: turing.bind,

  memoize: function(memo, fn) {
    var wrapper = function(n) {
      var result = memo[n];
      if (typeof result !== 'number') {
        result = fn(wrapper, n);
        memo[n] = result;
      }
      return result;
    };
    return wrapper;
  } 
};
/*jslint indent: 2, white: false, plusplus: false */

/*

* CSS2 selectors
* Generates a parser based on property lists that contain matchers
* Tokenizes

Notes:

http://www.w3.org/TR/CSS2/grammar.html
http://en.wikipedia.org/wiki/Lexical_analysis
http://nokogiri.org/lib/nokogiri/css/tokenizer_rex.html
http://github.com/jeresig/sizzle/blob/master/sizzle.js
http://github.com/digitarald/sly/blob/master/Sly.js
http://gnosis.cx/TPiP/chap4.txt
http://www.w3.org/TR/CSS2/selector.html

Algorithms:

https://developer.mozilla.org/en/Writing_Efficient_CSS
http://blog.twoalex.com/2010/02/26/a-shocking-truth-about-css/
http://dl.dropbox.com/u/598365/css3-compat/css3-compat.html?engine=sly#target

*/

(function() {
  var dom = {}, InvalidFinder = Error, macros, rules, tokenMap,
      find, matchMap, findMap, filter, scannerRegExp;

  macros = {
    'nl':        '\n|\r\n|\r|\f',
    'w':         '[\s\r\n\f]*',
    'nonascii':  '[^\0-\177]',
    'num':       '-?([0-9]+|[0-9]*\.[0-9]+)',
    'unicode':   '\\[0-9A-Fa-f]{1,6}(\r\n|[\s\n\r\t\f])?',
    'escape':    '#{unicode}|\\[^\n\r\f0-9A-Fa-f]',
    'nmchar':    '[_A-Za-z0-9-]|#{nonascii}|#{escape}',
    'nmstart':   '[_A-Za-z]|#{nonascii}|#{escape}',
    'ident':     '[-@]?(#{nmstart})(#{nmchar})*',
    'name':      '(#{nmchar})+',
    'string1':   '"([^\n\r\f"]|#{nl}|#{nonascii}|#{escape})*"',
    'string2':   "'([^\n\r\f']|#{nl}|#{nonascii}|#{escape})*'",
    'string':    '#{string1}|#{string2}'
  };

  rules = {
    'name and id':    '(#{ident}##{ident})',
    'id':             '(##{ident})',
    'class':          '(\\.#{ident})',
    'name and class': '(#{ident}\\.#{ident})',
    'element':        '(#{ident})',
    'pseudo class':   '(:#{ident})'
  };

  function scanner() {
    function replacePattern(pattern, patterns) {
      var matched = true, match;
      while (matched) {
        match = pattern.match(/#\{([^}]+)\}/);
        if (match && match[1]) {
          pattern = pattern.replace(new RegExp('#\{' + match[1] + '\}', 'g'), patterns[match[1]]);
          matched = true;
        } else {
          matched = false;
        }
      }
      return pattern;
    }

    function escapePattern(text) {
      return text.replace(/\//g, '//');
    }

    function convertPatterns() {
      var key, pattern, results = {}, patterns, source;

      if (arguments.length === 2) {
        source = arguments[0];
        patterns = arguments[1];
      } else {
        source = arguments[0];
        patterns = arguments[0];
      }

      for (key in patterns) {
        pattern = escapePattern(replacePattern(patterns[key], source));
        results[key] = pattern;
      }

      return results;
    }

    function joinPatterns(regexps) {
      var results = [], key;
      for (key in regexps) {
        results.push(regexps[key]);
      }
      return new RegExp(results.join('|'), 'g');
    }

    return joinPatterns(
      convertPatterns(convertPatterns(macros), rules)
    );
  }

  scannerRegExp = scanner();

  find = {
    byId: function(root, id) {
      return [root.getElementById(id)];
    },

    byNodeName: function(root, tagName) {
      var i, results = [], nodes = root.getElementsByTagName(tagName);
      for (i = 0; i < nodes.length; i++) {
        results.push(nodes[i]);
      }
      return results;
    },

    byClassName: function(root, className) {
      var i, results = [], nodes = root.getElementsByTagName('*');
      for (i = 0; i < nodes.length; i++) {
        if (nodes[i].className.match('\\b' + className + '\\b')) {
          results.push(nodes[i]);
        }
      }
      return results;
    }
  };

  findMap = {
    'id': function(root, selector) {
      selector = selector.split('#')[1];
      return find.byId(root, selector);
    },

    'name and id': function(root, selector) {
      var matches = selector.split('#'), name, id;
      name = matches[0];
      id = matches[1];
      return filter.byAttr(find.byId(root, id), 'nodeName', name.toUpperCase());
    },

    'name': function(root, selector) {
      return find.byNodeName(root, selector);
    },

    'class': function(root, selector) {
      selector = selector.split('\.')[1];
      return find.byClassName(root, selector);
    },

    'name and class': function(root, selector) {
      var matches = selector.split('\.'), name, className;
      name = matches[0];
      className = matches[1];
      return filter.byAttr(find.byClassName(root, className), 'nodeName', name.toUpperCase());
    }
  };

  if (typeof document.getElementsByClassName !== 'undefined') {
    find.byClassName = function(root, className) {
      return root.getElementsByClassName(className);
    };
  }

  filter = {
    byAttr: function(elements, attribute, value) {
      var key, results = [];
      for (key in elements) {
        if (elements[key] && elements[key][attribute] === value) {
          results.push(elements[key]);
        }
      }
      return results;
    }
  };

  matchMap = {
    'id': function(element, selector) {
      selector = selector.split('#')[1];
      return element && element.id === selector;
    },

    'name': function(element, nodeName) {
      return element.nodeName === nodeName.toUpperCase();
    },

    'name and id': function(element, selector) {
      return matchMap.id(element, selector) && matchMap.name(element, selector.split('#')[0]);
    },

    'class': function(element, selector) {
      if (element && element.className) {
        selector = selector.split('\.')[1];
        return element.className.match('\\b' + selector + '\\b'); 
      }
    },

    'name and class': function(element, selector) {
      return matchMap['class'](element, selector) && matchMap.name(element, selector.split('\.')[0]);
    }
  };

  function Searcher(root, tokens) {
    this.root = root;
    this.key_selector = tokens.pop();
    this.tokens = tokens;
    this.results = [];
  }

  Searcher.prototype.matchesToken = function(element, token) {
    if (!matchMap[token.finder]) {
      throw new InvalidFinder('Invalid matcher: ' + token.finder); 
    }
    return matchMap[token.finder](element, token.identity);
  };

  Searcher.prototype.find = function(token) {
    if (!findMap[token.finder]) {
      throw new InvalidFinder('Invalid finder: ' + token.finder); 
    }
    return findMap[token.finder](this.root, token.identity); 
  };

  Searcher.prototype.matchesAllRules = function(element) {
    var tokens = this.tokens.slice(), token = tokens.pop(),
        ancestor = element.parentNode, matchFound = false;
    if (!token || !ancestor) return false;

    while (ancestor && token) {
      if (this.matchesToken(ancestor, token)) {
        matchFound = true;
        token = tokens.pop();
      }
      ancestor = ancestor.parentNode;
    }

    return matchFound && tokens.length === 0;
  };

  Searcher.prototype.parse = function() {
    // Find all elements with the key selector
    var i, element, elements = this.find(this.key_selector), results = [];

    // Traverse upwards from each element to see if it matches all of the rules
    for (i = 0; i < elements.length; i++) {
      element = elements[i];
      if (this.tokens.length > 0) {
        if (this.matchesAllRules(element)) {
          results.push(element);
        }
      } else {
        if (this.matchesToken(element, this.key_selector)) {
          results.push(element);
        }
      }
    }
    return results;
  };

  Searcher.prototype.values = function() {
    return this.results;
  };

  function normalize(text) {
    return text.replace(/^\s+|\s+$/g, '').replace(/[ \t\r\n\f]+/g, ' ');
  }

  // Tokens are used by the Tokenizer
  function Token(identity, finder) {
    this.identity = identity;
    this.finder   = finder;
  }

  Token.prototype.toString = function() {
    return 'identity: ' + this.identity + ', finder: ' + this.finder;
  };

  // Tokenizer: classify sections of the scanner output
  function Tokenizer(selector) {
    this.selector = normalize(selector);
    this.tokens = [];
    this.tokenize();
  }

  Tokenizer.prototype.tokenize = function() {
    var match, r, finder;

    r = scannerRegExp;
    r.lastIndex = 0;

    while (match = r.exec(this.selector)) {
      finder = null;

      if (match[10]) {
        finder = 'id';
      } else if (match[1]) {
        finder = 'name and id';
      } else if (match[29]) {
        finder = 'name';
      } else if (match[15]) {
        finder = 'class';
      } else if (match[20]) {
        finder = 'name and class';
      }
      this.tokens.push(new Token(match[0], finder));
    }
    return this.tokens;
  };

  Tokenizer.prototype.finders = function() {
    var i, results = [];
    for (i in this.tokens) {
      results.push(this.tokens[i].finder);
    }
    return results;
  };

  dom.tokenize = function(selector) {
    var tokenizer = new Tokenizer(selector);
    return tokenizer;
  };

  dom.get = function(selector) {
    var tokens = dom.tokenize(selector).tokens,
        searcher = new Searcher(document, tokens);
    return searcher.parse();
  };

  turing.dom = dom;
})();

(function() {
  var events = {}, cache = [];

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
      fix(event, element);
      return element.fireEvent('on' + type, event)
    } else {
      event = document.createEvent('HTMLEvents');
      fix(event, element);
      event.initEvent(type, true, true);
      return !element.dispatchEvent(event);
    }
  };

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

(function() {
  turing.aliasFramework = function() {
    var alias = function() {
      return turing.dom.get(arguments[0]);
    }

    if (turing.enumerable) {
      turing.enumerable.each(turing.enumerable, function(fn, method) {
        alias[method] = fn;
      });
    }

    if (turing.dom) {
      alias.dom = turing.dom;
    }

    if (turing.events) {
      alias.events = turing.events;
    }

    return alias;
  };

  eval(turing.alias + ' = turing.aliasFramework()');  
})();
