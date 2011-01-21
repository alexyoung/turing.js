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
    jade = require('jade');

app.configure(function() {
  app.use(express.methodOverride());
  app.use(express.bodyDecoder());
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
  fs.readFile(__dirname + '/ajax.jade', function(err, data) {
    res.send(jade.render(data));
  });
});

staticFile('/turing.js', '/../../build/turing.js');
staticFile('/test.js', '/ajax-client.js');
staticFile('/turing-test.js', '/../turing-test/turing-test.js');
staticFile('/turing-test/lib/test.js', '/../turing-test/lib/test.js');
staticFile('/turing-test/lib/assert.js', '/../turing-test/lib/assert.js');
staticFile('/turing-test/stylesheets/screen.css', '/../turing-test/stylesheets/screen.css');

/**
  * Ajax tests
  */
app.get('/get-test', function(req, res) {
  res.send({ key: 'value' });
});

app.post('/post-test', function(req, res) {
  res.send(req.body.key);
});

app.listen(3000);

