require.paths.unshift('./turing-test/lib');

if (typeof turing === 'undefined')
  turing = require('../turing.core.js').turing;

var test = require('test'),
    assert = require('assert');

require('../turing.dom.js');
require('../turing.plugins.js');

function registerExamplePlugin() {
  turing.plugins.register('turnRed', {
    name: 'Turn Things Red',
    version: '1.0.0',
    description: 'Turns the background red',
    author: 'Alex Young <alex@example.com>',
    licenses: [ { type: 'MIT' } ],

    turnRed: function() {
      this[0].style.backgroundColor = '#ff0000';
      return this;
    }
  });
}

exports.testPlugins = {
  'test plugin registration and removal': function() {
    registerExamplePlugin();

    assert.ok(turing('#example').turnRed());

    turing.plugins.remove('turnRed');
    assert.ok(!turing.plugins.hasOwnProperty('turnRed'));
  },

  'test AlreadyRegistered': function() {
    registerExamplePlugin();

    assert.throws(function() {
      registerExamplePlugin();
    }, turing.plugins.AlreadyRegistered);
  },

  'test removing a non-existent plugin': function() {
    assert.throws(function() {
      turing.plugins.remove('turnBlue');
    }, turing.plugins.NotFound);
  }
};

test.run(exports);

