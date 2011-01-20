var exec = require('child_process').exec;

desc('Updates the documentation from GitHub');
task('docs', [], function() {
  exec('curl -O https://github.com/alexyoung/turing.js/raw/master/docs/index.html');
});

