/*!
 * Turing Ajax Functional Tests
 * Copyright (C) 2010-2011 Alex R. Young
 * MIT Licensed
 */

/**
 * These tests may be run with Node.
 */

var express = require('express'),
    app = express.createServer(),
    fs = require('fs'),
    path = require('path'),
    jade = require('jade');

app.configure(function() {
  app.use(express.logger({ format: '\x1b[1m:method\x1b[0m \x1b[33m:url\x1b[0m :response-time ms' }));
  app.use(express.methodOverride());
  app.use(express.bodyParser());
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.static(path.join(__dirname, '..', '..', 'build')));
  app.use(app.router);
  app.set('view engine', 'jade');
});

function staticFile(url, path) {
  app.get(url, function(req, res) {
    fs.readFile(__dirname + path, function(err, data) {
      res.contentType(path);
      res.send(data);
    });
  });
}

app.get('/', function(req, res) {
  res.render('index', { layout: false });
});

staticFile('/turing-test.js', '/../turing-test/turing-test.js');
staticFile('/turing-test/lib/test.js', '/../turing-test/lib/test.js');
staticFile('/turing-test/lib/assert.js', '/../turing-test/lib/assert.js');
staticFile('/turing-test/stylesheets/screen.css', '/../turing-test/stylesheets/screen.css');

/**
  * Ajax tests
  */
app.get('/get-test', function(req, res) {
  res.header('content-type', 'text/html');
  res.send('Sample text');
});

app.post('/post-test', function(req, res) {
  res.send(req.body.key);
});

app.post('/post-array', function(req, res) {
  res.send(req.body[0]);
});

app.post('/give-me-json', function(req, res) {
  res.header('content-type', 'application/json');
  res.send({ key: 'value' });
});

app.post('/give-me-xml', function(req, res) {
  res.header('content-type', 'application/xml');
  res.send('<key>value</key>');
});

app.listen(3000);

