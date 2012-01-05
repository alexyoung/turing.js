/*!
 * Turing Core
 * Copyright (C) 2011 Alex R. Young
 * MIT Licensed
 */

/**
 * Contains everything relating to the `require` module.
 */
define('turing.require', ['turing.core'], function(turing) {
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
        fn(options);
      });
  }

  /**
   * Parse and run a queue of scripts, preloading where required.
   *
   * TODO: Handle remote scripts
   *
   * @param {Array} An array of scripts.
   */
  function Queue(sources) {
    this.sources = sources;
    this.events = new turing.events.Emitter();
    this.queue = [];
    this.currentGroup = 0;
    this.groups = {};
    this.groupKeys = [];
    this.parseQueue(this.sources, false, 0);

    this.installEventHandlers();
    this.pointer = 0;
    this.preloadCount = 0;

    var self = this;
    runWhenReady(function() {
      self.runQueue();
    });
  }

  Queue.prototype = {
    on: function() {
      this.events.on.apply(this.events, arguments);
      return this;
    },

    emit: function() {
      this.events.emit.apply(this.events, arguments);
      return this;
    },

    installEventHandlers: function() {
      var self = this;

      this.on('preloaded', function(groupItem, options) {
        var group = self.groups[groupItem.group];
        groupItem.preloaded = true;
        groupItem.scriptOptions = options;
        self.preloadCount--;

        if (self.preloadCount === 0) {
          self.emit('preload-complete');
        }
      });

      this.on('preload-complete', function() {
        this.emit('execute-next');
      });

      this.on('execute-next', function() {
        var groupItem = self.nextItem();

        function completeCallback() {
          groupItem.loaded = true;
          self.emit('loaded', groupItem);
          self.emit('execute-next');
        }

        if (groupItem) {
          if (groupItem.preload) {
            self.execute(groupItem, completeCallback);
          } else {
            self.fetchExecute(groupItem, completeCallback);
          }
        } else {
          self.emit('complete');
        }
      });
    },

    nextItem: function() {
      var group, i, j, item;

      for (i = 0; i < this.groupKeys.length; i++) {
        group = this.groups[this.groupKeys[i]];
        for (j = 0; j < group.length; j++) {
          item = group[j];
          if (!item.loaded) {
            return item;
          }
        }
      }
    },

    fetchExecute: function(item, fn) {
      var self = this;
      requireWithScriptInsertion(item.src, { async: true, defer: true }, function() {
        fn();
      });
    },

    execute: function(item, fn) {
      if (item && item.scriptOptions) {
        script = createScript(item.scriptOptions);
        insertScript(script);
        appendTo.removeChild(script);
      }

      fn();
    },

    enqueue: function(source, async) {
      var preload = isSameOrigin(source),
          options;

      options = {
        src: source,
        preload: preload,
        async: async,
        group: this.currentGroup
      };

      if (!this.groups[this.currentGroup]) {
        this.groups[this.currentGroup] = [];
        this.groupKeys.push(this.currentGroup);
      }

      this.groups[this.currentGroup].push(options);
    },

    parseQueue: function(sources, async, level) {
      var i, source;
      for (i = 0; i < sources.length; i++) {
        source = sources[i];
        if (turing.isArray(source)) {
          this.currentGroup++;
          this.parseQueue(source, true, level + 1);
        } else {
          if (level === 0) {
            this.currentGroup++;
          }
          this.enqueue(source, async);
        }
      }
    },

    runQueue: function() {
      // Preload everything that can be preloaded
      this.preloadAll();
    },

    preloadAll: function() {
      var i, g, group, item, self = this;
      for (g = 0; g < this.groupKeys.length; g++) {
        group = this.groups[this.groupKeys[g]];
        
        for (i = 0; i < group.length; i++ ) {
          item = group[i];

          if (item.preload) {
            this.preloadCount++;
            (function(groupItem) {
              requireWithXMLHttpRequest(groupItem.src, {}, function(script) {
                self.emit('preloaded', groupItem, script);
              })
            }(item));
          }
        }
      }

      if (this.preloadCount === 0) {
        this.emit('execute-next');
      }
    }
  };

  function runWhenReady(fn) {
    setTimeout(function() {
      if ('item' in appendTo) {
        if (!appendTo[0]) {
          return setTimeout(arguments.callee, 25);
        }

        appendTo = appendTo[0];
      }

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

    if (turing.isArray(scriptSrc)) {
      return new Queue(scriptSrc);
    }

    runWhenReady(function() {
      switch (options.transport) {
        case 'XMLHttpRequest':
          return requireWithXMLHttpRequest(scriptSrc, options, function(options) {
            var script = createScript(options);
            insertScript(script);
            appendTo.removeChild(script);
            fn();
          });

        case 'scriptInsertion':
          return requireWithScriptInsertion(scriptSrc, options, fn);

        default:
          return requireWithScriptInsertion(scriptSrc, options, fn);
      }
    });
  };

  turing.require.isSameOrigin = isSameOrigin;
  return turing.require;
});
