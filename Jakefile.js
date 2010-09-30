function nodeTasks() {
  var sys = require('sys'),
      path = require('path'),
      fs = require('fs'),
      jsmin = require('jsmin').jsmin;

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

  desc('Main build task');
  task('build', ['concat', 'minify'], function() {});
}

function narwhalTasks() {
  var jake = require('jake'),
      shrinksafe = require('minify/shrinksafe'),
      FILE = require('file'),
      SYSTEM = require('system')

  jake.task('concat', function(t) {
    var output = '',
        files = ('turing.core.js turing.oo.js turing.enumerable.js '
                + 'turing.functional.js turing.dom.js turing.events.js '
                + 'turing.touch.js turing.alias.js turing.anim.js').split(' ')

    files.map(function(file) {
      output += FILE.read(file)
    })

    if (!FILE.exists('build')) {
      FILE.mkdir('build')
    }

    FILE.write(FILE.join('build', 'turing.js'), output)
  })

  jake.task('minify', function(t) {
    var shrunk = shrinksafe.compress(FILE.read(FILE.join('build', 'turing.js')))
    FILE.write(FILE.join('build', 'turing.min.js'), shrunk)
  })

  jake.task('build', ['concat', 'minify'])
}

if (typeof global.system === 'undefined') {
  nodeTasks();
} else {
  narwhalTasks();
}
