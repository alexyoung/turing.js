require.paths.unshift('./turing-test/lib');

turing = require('../turing.core.js').turing;
var test = require('test'),
    assert = require('assert');

require('../turing.enumerable.js');
require('../turing.anim.js');

exports.testAnimations = {
  'test hex colour converts to RGB': function() {
    assert.equal('rgb(255, 0, 255)', turing.anim.parseColour('#ff00ff').toString());
  },

  'test RGB colours are left alone': function() {
    assert.equal('rgb(255, 255, 255)', turing.anim.parseColour('rgb(255, 255, 255)').toString());
  },

  'test chained animations': function() {
    var box = document.getElementById('box');
    turing.anim.chain(box)
      .highlight()
      .pause(250)
      .move(100, { x: '100px', y: '100px', easing: 'ease-in-out' })
      .animate(250, { width: '1000px' })
      .fadeOut(250)
      .pause(250)
      .fadeIn(250)
      .animate(250, { width: '20px' });

    setTimeout(function() { assert.equal(box.style.top, '100px'); }, 350);
    setTimeout(function() { assert.equal(box.style.width, '20px'); }, 2000);
  }
};

test.run(exports);

