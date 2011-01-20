var sys = require('sys'),
    path = require('path'),
    fs = require('fs'),
    jsmin = require('jsmin').jsmin,
    exec = require('child_process').exec;

function generateDocs() {
  exec('dox --title Turing turing.*.js  > docs/index.html');
}

desc('Builds build/turing.js.');
task('concat', [], function() {
  var files = ('turing.core.js turing.oo.js turing.enumerable.js '
              + 'turing.functional.js turing.dom.js turing.events.js '
              + 'turing.touch.js turing.alias.js turing.anim.js').split(' '),
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
