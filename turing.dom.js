/*!
 * Turing DOM
 * Copyright (C) 2010-2011 Alex R. Young
 * MIT Licensed
 */

/**
 * The Turing DOM module.
 */
(function() {
  var dom = {}, InvalidFinder = Error, macros, rules, tokenMap,
      find, matchMap, findMap, filter, scannerRegExp, nodeTypes,
      getStyle, setStyle, cssNumericalProperty, propertyFix,
      getAttributeParamFix;

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

  nodeTypes = {
    ELEMENT_NODE:                  1,
    ATTRIBUTE_NODE:                2,
    TEXT_NODE:                     3,
    CDATA_SECTION_NODE:            4,
    ENTITY_REFERENCE_NODE:         5,
    ENTITY_NODE:                   6,
    PROCESSING_INSTRUCTION_NODE:   7,
    COMMENT_NODE:                  8,
    DOCUMENT_NODE:                 9,
    DOCUMENT_TYPE_NODE:            10,
    DOCUMENT_FRAGMENT_NODE:        11,
    NOTATION_NODE:                 12
  };

  cssNumericalProperty = {
    'zIndex':     true,
    'fontWeight': true,
    'opacity':    true,
    'zoom':       true,
    'lineHeight': true
  };

  rules = {
    'name and id':    '(#{ident}##{ident})',
    'id':             '(##{ident})',
    'class':          '(\\.#{ident})',
    'name and class': '(#{ident}\\.#{ident})',
    'element':        '(#{ident})',
    'pseudo class':   '(:#{ident})'
  };

  propertyFix = {
    tabindex:        'tabIndex',
    readonly:        'readOnly',
    'for':           'htmlFor',
    'class':         'className',
    maxlength:       'maxLength',
    cellspacing:     'cellSpacing',
    cellpadding:     'cellPadding',
    rowspan:         'rowSpan',
    colspan:         'colSpan',
    usemap:          'useMap',
    frameborder:     'frameBorder',
    contenteditable: 'contentEditable'
  };

  getAttributeParamFix = {
    width: true,
    height: true,
    src: true,
    href: true
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
      if (root === null) return [];
      return [root.getElementById(id)];
    },

    byNodeName: function(root, tagName) {
      if (root === null) return [];
      var i, results = [], nodes = root.getElementsByTagName(tagName);
      for (i = 0; i < nodes.length; i++) {
        results.push(nodes[i]);
      }
      return results;
    },

    byClassName: function(root, className) {
      if (root === null) return [];
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
    if (this.tokens.length === 0) return;

    var i = this.tokens.length - 1,
        token = this.tokens[i],
        matchFound = false;

    while (i >= 0 && element) {
      if (this.matchesToken(element, token)) {
        matchFound = true;
        i--;
        token = this.tokens[i];
      }
      element = element.parentNode;
    }

    return matchFound && i < 0;
  };

  Searcher.prototype.parse = function() {
    // Find all elements with the key selector
    var i, element, elements = this.find(this.key_selector), results = [];

    // Traverse upwards from each element to see if it matches all of the rules
    for (i = 0; i < elements.length; i++) {
      element = elements[i];
      if (this.tokens.length > 0) {
        if (this.matchesAllRules(element.parentNode)) {
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

  function get(selector, root) {
    var tokens = dom.tokenize(selector).tokens,
        searcher = new Searcher(root, tokens);
    return searcher.parse();
  }

  turing.addDetectionTest('querySelectorAll', function() {
    var div = document.createElement('div');
    div.innerHTML = '<p class="TEST"></p>';

    // Some versions of Safari can't handle uppercase in quirks mode
    if (div.querySelectorAll) {
      if (div.querySelectorAll('.TEST').length === 0) return false;
      return true;
    }

    // Helps IE release memory associated with the div
    div = null;
    return false;
  });

  /**
   * Converts property names with hyphens to camelCase.
   *
   * @param {String} text A property name
   * @returns {String} text A camelCase property name
   */
  function camelCase(text) {
    if (typeof text !== 'string') return;
    return text.replace(/-([a-z])/ig, function(all, letter) { return letter.toUpperCase(); });
  };

  /**
   * Converts property names in camelCase to ones with hyphens.
   *
   * @param {String} text A property name
   * @returns {String} text A camelCase property name
   */
  function uncamel(text) {
    if (typeof text !== 'string') return;
    return text.replace(/([A-Z])/g, '-$1').toLowerCase();
  };

  function invalidCSSNode(element) {
    return !element || element.nodeType === nodeTypes.TEXT_NODE || element.nodeType === nodeTypes.COMMENT_NODE || !element.style;
  }

  function setStyleProperty(element, property, value) {
    if (invalidCSSNode(element)) {
      return;
    }

    if (typeof value === 'number' && !cssNumericalProperty[property]) {
      value += 'px';
    }

    element.style[property] = value;
  }

  if (document.documentElement.currentStyle) {
    getStyle = function(element, property) {
      return element.currentStyle[camelCase(property)];
    };

    setStyle = function(element, property, value) {
      return setStyleProperty(element, camelCase(property), value);
    };
  } else if (document.defaultView.getComputedStyle) {
    getStyle = function(element, property) {
      return element.ownerDocument.defaultView.getComputedStyle(element, null).getPropertyValue(uncamel(property));
    };

    setStyle = function(element, property, value) {
      return setStyleProperty(element, uncamel(property), value);
    };
  }

  /**
   * Gets or sets style values.
   *
   * @param {Object} element A DOM element 
   * @returns {Object} The style value
   */
  dom.css = function(element, options) {
    if (typeof options === 'string') {
      return getStyle(element, options);
    } else {
      for (var property in options) {
        if (options.hasOwnProperty(property)) {
          setStyle(element, property, options[property]);
        }
      }
    }
  };

  /**
   * Finds DOM elements based on a CSS selector.
   *
   * @param {String} selector A CSS selector
   * @returns {Array} The elements
   */
  dom.get = function(selector) {
    var root = typeof arguments[1] === 'undefined' ? document : arguments[1];
    return turing.toArray(turing.detect('querySelectorAll') ?
      root.querySelectorAll(selector) : get(selector, root));
  };

  /**
   * Does an element satify a selector, based on root element?
   *
   * @param {Object} element A DOM element
   * @param {String} selector A CSS selector
   * @param {Object} root The root DOM element
   * @returns {Object} The matching DOM element
   */
  dom.findElement = function(element, selector, root) {
    var tokens = dom.tokenize(selector).tokens,
        searcher = new Searcher(root, []);
    searcher.tokens = tokens;
    while (element) {
      if (searcher.matchesAllRules(element)) {
        return element;
      }
      element = element.parentNode;
    }
  };

  function manipulateDOM(element, html, callback) {
    var context = document,
        isTable = element.nodeName === 'TABLE',
        shim,
        div;

    div = context.createElement('div');
    div.innerHTML = '<' + element.nodeName + '>' + html + '</' + element.nodeName + '>';
    shim = isTable ? div.lastChild.lastChild : div.lastChild;
    callback(isTable ? element.lastChild : element, shim);
    div = null;
  };

  function getText(elements) {
    var results = '', element, i;

    for (i = 0; elements[i]; i++) {
      element = elements[i];
      if (element.nodeType === nodeTypes.TEXT_NODE 
          || element.nodeType === nodeTypes.CDATA_SECTION_NODE) {
        results += element.nodeValue;
      } else if (element.nodeType !== nodeTypes.COMMENT_NODE) {
        results += getText(element.childNodes);
      }
    }

    return results;
  };

  /**
   * Replaces the content of an element.
   *
   * @param {Object} element A DOM element
   * @param {String} html A string containing HTML
   */
  dom.replace = function(element, html) {
    manipulateDOM(element, html, function(insert, shim) {
      element.replaceChild(shim, insert);
    });
  };

  /**
   * Appends an element to the end of an element.
   *
   * @param {Object} element A DOM element
   * @param {String} html A string containing HTML
   */
  dom.append = function(element, html) {
    manipulateDOM(element, html, function(insertTo, shim) {
      insertTo.appendChild(shim.firstChild);
    });
  };

  /**
   * Set or get innerHTML.
   *
   * @param {Object} element A DOM element
   * @param {String} html A string containing HTML
   */
  dom.html = function(element, html) {
    if (arguments.length === 1) {
      return element.innerHTML;
    }

    try {
      element.innerHTML = html;
    } catch (e) {
      dom.replace(element, html);
    }
  };

  /**
   * Set or get text nodes.
   *
   * @param {Object} element A DOM element
   * @param {String} text A string containing text
   */
  dom.text = function(element, text) {
    if (arguments.length === 1) {
      return getText(element);
    } else {
      dom.empty(element);
      element.appendChild(document.createTextNode(text));
    }
  };

  /**
   * Empty nodes.
   *
   * @param {Object} element A DOM element
   */
  dom.empty = function(element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  };

  /**
   * Append CSS classes.
   *
   * @param {Object} element A DOM element
   * @param {String} className The class name
   */
  dom.addClass = function(element, className) {
    if (!className || typeof className !== 'string') return;
    if (element.nodeType !== nodeTypes.ELEMENT_NODE) return;
    if (element.classList) return element.classList.add(className);

    if (element.className && element.className.length) {
      if (!element.className.match('\\b' + className + '\\b')) {
        element.className += ' ' + className;
      }
    } else {
      element.className = className;
    }
  };

  /**
   * Remove CSS classes.
   *
   * @param {Object} element A DOM element
   * @param {String} className The class name
   */
  dom.removeClass = function(element, className) {
    if (!className || typeof className !== 'string') return;
    if (element.nodeType !== nodeTypes.ELEMENT_NODE) return;
    if (element.classList) return element.classList.remove(className);

    if (element.className) {
      element.className = element.className.
        replace(new RegExp('\\s?\\b' + className + '\\b'), '').
        replace(/^\s+/, '');
    }
  };

  turing.addDetectionTest('getAttribute', function() {
    var div = document.createElement('div');
    div.innerHTML = '<a href="/example"></a>';

    if (div.childNodes[0].getAttribute('href') === '/example') {
      return true;
    }

    // Helps IE release memory associated with the div
    div = null;
    return false;
  });

  function getAttribute(element, name) {
    if (propertyFix[name]) {
      name = propertyFix[name];
    }

    if (getAttributeParamFix[name]) {
      return element.getAttribute(name, 2);
    }

    if (name === 'value' && element.nodeName === 'BUTTON') {
      return element.getAttributeNode(name).nodeValue;
    }

    return element.getAttribute(name);
  }

  function setAttribute(element, name, value) {
    if (propertyFix[name]) {
      name = propertyFix[name];
    }

    if (name === 'value' && element.nodeName === 'BUTTON') {
      return element.getAttributeNode(name).nodeValue = value;
    }

    return element.setAttribute(name, value);
  }

  function removeAttribute(element, name) {
    if (element.nodeType !== nodeTypes.ELEMENT_NODE) return;
    if (propertyFix[name]) name = propertyFix[name];
    setAttribute(element, name, '');
    element.removeAttributeNode(element.getAttributeNode(name));
  }

  /**
   * Removes an attribute from a node.
   *
   * @param {Object} element A DOM element
   * @param {String} attribute The attribute name
   */
  dom.removeAttr = function(element, attribute) {
    turing.detect('getAttribute') ?
      element.removeAttribute(attribute) : removeAttribute(element, attribute);
  };

  /**
   * Get or set attributes.
   *
   * @param {Object} element A DOM element
   * @param {String} attribute The attribute name
   * @param {String} value The attribute value
   */
  dom.attr = function(element, attribute, value) {
    if (typeof value === 'undefined') {
      return turing.detect('getAttribute') ?
        element.getAttribute(attribute) : getAttribute(element, attribute);
    } else {
      if (value === null) {
        return dom.removeAttr(element, attribute);
      } else {
        return turing.detect('getAttribute') ?
          element.setAttribute(attribute, value) : setAttribute(element, attribute, value);
      }
    }
  };

  // Chained API
  turing.init(function(arg) {
    if (typeof arg === 'string' || typeof arg === 'undefined') {
      // CSS selector
      return turing.domChain.init(arg);
    }
  });

  turing.domChain = {
    init: function(selector) {
      this.selector = selector;
      this.length = 0;
      this.prevObject = null;
      this.elements = [];

      if (!selector) {
        return this;
      } else {
        return this.find(selector);
      }
    },

    writeElements: function() {
      for (var i = 0; i < this.elements.length; i++) {
        this[i] = this.elements[i];
      }
    },

    /**
      * `first` will return a domChain with a length of 1 or 0.
      */
    first: function() {
      var elements = [],
          ret = turing.domChain;
      ret.elements = this.elements.length === 0 ? [] : [this.elements[0]];
      ret.selector = this.selector;
      ret.length = ret.elements.length;
      ret.prevObject = this;
      ret.writeElements();
      return ret;
    },

    /**
     * Get or set innerHTML.  Applied to every element.
     *
     * @param {String} html A string containing HTML
     * @returns {Object} `this` or the innerHTML
     */
    html: function(html) {
      if (arguments.length === 0) {
        return this.elements.length === 0 ? null : dom.html(this[0]);
      } else {
        for (var i = 0; i < this.elements.length; i++) {
          dom.html(this[i], html);
        }
      }
      return this;
    },

    /**
     * Get or set text nodes.  Applied to every element.
     *
     * @param {String} text A string containing text to set
     * @returns {Object} `this` or the text content
     */
    text: function(text) {
      if (arguments.length === 0) {
        return this.elements.length === 0 ? null : getText(this.elements);
      } else {
        for (var i = 0; i < this.elements.length; i++) {
          dom.text(this.elements[i], text);
        }
      }
      return this;
    },

    /**
     * Get or set styles.
     *
     * @param {Objects} options Either options for a style to set or a property name
     * @returns {Object} `this` or the style property
     */
    css: function(options) {
      if (typeof options === 'string') {
        return this.elements.length > 0 ? getStyle(this.elements[0], options) : null;
      } else {
        for (var i = 0; i < this.elements.length; i++) {
          dom.css(this[i], options);
        }
      }
      return this;
    },

    /**
     * Add class names.
     *
     * @param {String} className A class name
     * @returns {Object} `this`
     */
    addClass: function(className) {
      for (var i = 0; i < this.elements.length; i++) {
        dom.addClass(this[i], className);
      }
      return this;
    },

    /**
     * Remove class names.
     *
     * @param {String} className A class name
     * @returns {Object} `this`
     */
    removeClass: function(className) {
      for (var i = 0; i < this.elements.length; i++) {
        dom.removeClass(this[i], className);
      }
      return this;
    },

    /**
     * Get or set an attribute.
     *
     * @param {String} attribute The attribute name
     * @param {String} value The attribute value
     * @returns {String} The attribute value
     */
    attr: function(attribute, value) {
      if (this.elements.length > 0) {
        return dom.attr(this[0], attribute, value);
      }
    },

    /**
     * Remove an attribute.
     *
     * @param {String} attribute The attribute name
     * @returns {Object} `this`
     */
    removeAttr: function(attribute) {
      if (this.elements.length > 0) {
        dom.removeAttr(this[0], attribute);
      }
      return this;
    },

    /**
     * Append HTML to an element.  Applied to every element.
     *
     * @param {String} html A string containing HTML
     * @returns {Object} `this`
     */
    append: function(html) {
      for (var i = 0; i < this.elements.length; i++) {
        dom.append(this[i], html);
      }
      return this;
    },

    find: function(selector) {
      var elements = [],
          ret = turing.domChain,
          root = document;

      if (this.prevObject) {
        if (this.prevObject.elements.length > 0) {
          root = this.prevObject.elements[0];
        } else {
          root = null;
        }
      }

      elements = dom.get(selector, root);
      this.elements = elements;
      ret.elements = elements;
      ret.selector = selector;
      ret.length = elements.length;
      ret.prevObject = this;
      ret.writeElements();
      return ret;
    }
  };

  turing.domChain.init.prototype = turing.domChain;

  /**
    * Enumerable methods can be chained with DOM calls:
    *
    *       turing('p').each(function(element) {
    *         console.log(element);
    *       });
    *
    */
  if (typeof turing.enumerable !== 'undefined') {
    turing.domChain['values'] = function() {
      return this.elements;
    };

    turing.enumerable.each(turing.chainableMethods, function(methodName) {
      turing.domChain[methodName] = function(fn) {
        var elements = turing.enumerable[methodName](this, fn),
            ret = turing.domChain;
        this.elements = elements;
        ret.elements = elements;
        ret.selector = this.selector;
        ret.length = elements.length;
        ret.prevObject = this;
        ret.writeElements();
        return ret;
      };
    });
  }

  dom.nodeTypes = nodeTypes;
  turing.dom = dom;
})();

