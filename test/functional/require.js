var express = require('express')
  , app = express.createServer();

app.configure('development', function() {
  app.use(express.static(__dirname + '/../../../turing.js'));
  app.use(express.static(__dirname + '/public'));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.get('/', function(req, res) {
  res.render('require/index.jade', { layout: 'require/layout' });
});

app.get('/min', function(req, res) {
  res.render('require/min.jade', { layout: 'require/layout' });
});

app.listen(3000);
