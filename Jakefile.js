var sys = require('sys'),
    path = require('path'),
    fs = require('fs'),
    jsmin = require('jsmin').jsmin,
    exec = require('child_process').exec;

desc('Builds build/turing.js.');
task('concat', [], function() {
  var files = ('turing.core.js turing.oo.js turing.enumerable.js turing.promise.js '
              + 'turing.functional.js turing.dom.js turing.plugins.js turing.events.js '
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
  exec('dox --title Turing turing.*.js --intro docs/intro.md > docs/index.html');
});

desc('Run tests');
task('tests', [], function() {
  require.paths.unshift('./test/turing-test/lib/');

  fs.readdir('test', function(err, files) {
    files.forEach(function(file) {
      if (file.match(/^[^.](.*)test\.js$/)) {
        try {
          console.log('\n*** ' + file + '\n');
          require('./test/' + file);
        } catch(e) {
        }
      }
    });
  });
});

desc('Main build task');
task('build', ['concat', 'minify', 'docs'], function() {});
