var turing = require(__dirname + '/../turing.core.js').turing,
    jsdom = require('jsdom'),
    fs = require('fs');

require(__dirname + '/../turing.promise.js')(turing);
require(__dirname + '/../turing.enumerable.js')(turing);

module.exports = turing;
module.exports.jsdom = jsdom;
module.exports.browser = function(html, fn) {
  var js = '',
      files = ('turing.core.js turing.oo.js turing.enumerable.js turing.promise.js '
              + 'turing.functional.js turing.dom.js turing.plugins.js turing.events.js '
              + 'turing.net.js turing.touch.js turing.anim.js').split(' ');

  files.forEach(function(file) {
    js += fs.readFileSync(__dirname + '/../' + file);
  });

  // The JavaScript in as an array seems to make `done` fire twice
  jsdom.env({
    html: html,
    src: [ js ],
    done: function(err, window) {
      if (err) throw(err);
      fn(window.turing);
    }
  });
};
