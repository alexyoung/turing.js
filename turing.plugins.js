/*!
 * Turing Plugins
 * Copyright (C) 2011 Alex R. Young
 * MIT Licensed
 */

/**
 * The Turing plugin module.
 *
 * This is an example plugin:
 *
 *     turing.plugins.register('turnRed', {
 *       name: 'Turn Things Red',
 *       version: '1.0.0',
 *       description: 'Turns the background red',
 *       author: 'Alex Young <alex@example.com>',
 *       licenses: [ { type: 'MIT' } ],
 *
 *       turnRed: function() {
 *         this[0].style.backgroundColor = '#ff0000';
 *         return this;
 *       }
 *     });
 *
 */
define('turing.plugins', ['turing.core'], function(turing) {
  var plugins = {};
  plugins.registered = {};
  plugins.AlreadyRegistered = Error;
  plugins.NotFound = Error;

  /**
   * Registers a plugin, making it available for
   * chained DOM calls.
   * 
   * Throws turing.plugins.AlreadyRegistered if a
   * plugin with the same name has been registered.
   *
   * @param {String} methodName The name of your plugin method 
   * @param {Object} metadata Your plugin
   */
  plugins.register = function(methodName, metadata) {
    if (plugins.registered[methodName]) {
      throw new plugins.AlreadyRegistered('Already registered a plugin called: ' + methodName);
    }

    plugins.registered[methodName] = metadata;
    turing.domChain[methodName] = metadata[methodName];
  };

  /**
   * Removes a plugin.  Throws turing.plugins.NotFound if
   * the plugin could not be found.
   *
   * @param {String} methodName The name of the plugin
   */
  plugins.remove = function(methodName) {
    if (!plugins.registered.hasOwnProperty(methodName)) {
      throw new plugins.NotFound('Plugin not found: ' + methodName);
    } else {
      delete plugins.registered[methodName]
      delete turing.domChain[methodName];
    }
  };

  turing.plugins = plugins;
  return plugins;
});
