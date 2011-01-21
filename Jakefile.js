var sys = require('sys'),
    path = require('path'),
    fs = require('fs'),
    jsmin = require('jsmin').jsmin,
    exec = require('child_process').exec;

function generateDocs() {
  var desc = '';
 
  desc += 'Turing is a JavaScript framework.  The source is available from GitHub at [alexyoung/turing.js](https://github.com/alexyoung/turing.js/).\n\n';
  desc += 'The DOM, Events, and Anim modules are chainable, like this:\n\n';
  desc += '        turing(\'p\')\n';
  desc += '          .fadeIn(2000)\n';
  desc += '          .animate(1000, { color: \'#ff0000\' })\n';
  desc += '          .click(function() { alert(\'clicked\'); });\n';
  desc += '\n';
  desc += 'This is the easiest way to use Turing.';


  exec('dox --title Turing turing.*.js --desc "' + desc + '" > docs/index.html');
}

desc('Builds build/turing.js.');
task('concat', [], function() {
  var files = ('turing.core.js turing.oo.js turing.enumerable.js '
              + 'turing.functional.js turing.dom.js turing.events.js '
              + 'turing.net.js turing.touch.js turing.anim.js').split(' '),
      filesLeft = files.length,
      pathName = '.',
      outFile = fs.openSync('build/turing.js', 'w+');

  files.forEach(function(fileName) {
    var fileName = path.join(pathName, fileName),
        contents = fs.readFileSync(fileName);
    sys.puts('Read: ' + contents.length + ', written: ' + fs.writeSync(outFile, contents.toString()));
  });
  fs.closeSync(outFile);
});

desc('Minifies!');
task('minify', [], function() {
  // TODO
});

desc('Documentation');
task('docs', [], function() {
  generateDocs();
});

desc('Main build task');
task('build', ['concat', 'minify', 'docs'], function() {});
