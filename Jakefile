var jake = require('jake'),
    shrinksafe = require('minify/shrinksafe'),
    FILE = require('file'),
    SYSTEM = require('system')

jake.task('concat', function(t) {
  var output = '',
      files = ('turing.core.js turing.oo.js turing.enumerable.js '
              + 'turing.functional.js turing.dom.js turing.events.js turing.alias.js turing.anim.js').split(' ')

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
