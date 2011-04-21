require.paths.unshift('./turing-test/lib');

if (typeof turing === 'undefined')
  turing = require('../turing.core.js').turing;

var test = require('test'),
    assert = require('assert');

require('../turing.dom.js');

exports.testDOM = {
  'test tokenization': function() {
    assert.equal('class', turing.dom.tokenize('.link').finders(), 'return class for .link');
    assert.equal('name and class', turing.dom.tokenize('a.link').finders(), 'return class and name for a.link');
  },

  'test selector finders': function() {
    assert.equal('dom-test', turing.dom.get('#dom-test')[0].id, 'find with id');
    assert.equal('dom-test', turing.dom.get('div#dom-test')[0].id, 'find with id and name');
    assert.equal('Example Link', turing.dom.get('a')[0].innerHTML, 'find with tag name');
    assert.equal('Text', turing.dom.get('p')[0].innerHTML, 'find with tag name');
    assert.equal('Example Link', turing.dom.get('#dom-test a.link')[0].innerHTML, 'find a link');
    assert.equal('DIV', turing.dom.get('.example1')[0].nodeName, 'find a class name by itself');
    assert.equal('Example Link', turing.dom.get('div#dom-test div p a.link')[0].innerHTML, 'find a nested link');
    assert.equal('Text', turing.dom.get('.example3 p')[0].innerHTML, 'find a nested tag');
    assert.equal(1, turing.dom.get('.example3 p').length, 'find a nested tag');
  },

  'test a selector that does not match anything': function() {
    assert.equal('', turing.dom.get('div#massive-explosion .failEarly p.lease'), 'not find anything');
  },

  'test chained DOM calls': function() {
    assert.equal(1, turing('.example3').find('p').length, 'find a nested tag');
  },

  'test a nested element': function() {
    var element = turing.dom.get('#dom-test a.link')[0];

    assert.equal(element, turing.dom.findElement(element, '#dom-test a.link', document), 'find elements with the right selector');
    assert.equal(undefined, turing.dom.findElement(turing.dom.get('#dom-test .example1 p')[0], 'a.link', document), 'not find elements with the wrong selector');
  },

  'test HTML can be written': function() {
    var element = turing.dom.get('#dom-html-tests')[0];
    turing.dom.html(element, '<p><a href="#">This is a link</a>');
    assert.equal(turing.dom.get('#dom-html-tests p').length, 1);
    assert.equal(turing.dom.get('#dom-html-tests a').length, 1);
  },

  'test chained HTML works on multiple elements': function() {
    turing('#dom-html-chain-test p').html('<a href="#">Link</a>');
    assert.equal(turing.dom.get('#dom-html-chain-test p a').length, 4);
  },

  'test manipulating table rows': function() {
    turing('#dom-html-table-test').html('<tr><td>1</td></tr><tr><td>2</td></tr>');
    assert.equal(turing.dom.get('#dom-html-table-test tr').length, 2);
  },

  'test manipulating table rows with tbody': function() {
    turing('#dom-html-table-tbody-test').html('<tr><td>3</td></tr><tr><td>4</td></tr>');
    assert.equal(turing.dom.get('#dom-html-table-tbody-test tr').length, 2);
  },

  'test HTML can be read': function() {
    assert.ok(turing('#dom-html-read-test').html().match(/<p>Example/i));
  },

  'test HTML can be appended': function() {
    turing('#dom-html-append').append('<p>Example 2</p>');
    assert.ok(turing('#dom-html-append').html().match(/Example[^E]*Example 2/));
  },

  'test HTML can be appended to tables': function() {
    turing('#dom-table-append').append('<tr><td>X2</td></tr>');
    assert.ok(turing('#dom-table-append').html().match(/X1[^X]*X2/));
  },

  'test text nodes can be read': function() {
    assert.ok(turing('#dom-html-read-test').text().match(/Example/));
  },

  'test text nodes can be written': function() {
    turing.dom.text(turing.dom.get('#dom-text-write-test p')[0], 'Written');
    assert.ok(turing.dom.get('#dom-text-write-test p')[0].innerHTML.match(/Written/));
  },

  'test chained text nodes can be written': function() {
    turing('#dom-text-write-test p').text('Written again');
    assert.ok(turing.dom.get('#dom-text-write-test p')[0].innerHTML.match(/Written again/));
  },

  'test nodes can be emptied': function() {
    turing.dom.empty(turing.dom.get('#dom-html-empty-test')[0]);
    assert.equal(turing.dom.get('#dom-html-empty-test')[0].innerHTML, '');
  },

  'test reading style properties': function() {
    var element = turing.dom.get('#dom-test')[0],
        expected = element.currentStyle ? '#f0f0f0' : 'rgb(240, 240, 240)';
    assert.equal(turing.dom.css(element, 'background-color'), expected);
    assert.equal(turing.dom.css(element, 'backgroundColor'), expected);
  },

  'test chained reading style properties': function() {
    var element = turing.dom.get('#dom-test')[0],
        expected = element.currentStyle ? '#f0f0f0' : 'rgb(240, 240, 240)';
    assert.equal(turing('#dom-test').css('background-color'), expected);
    assert.equal(turing('#dom-test').css('backgroundColor'), expected);
  },

  'test writing style properties': function() {
    var element = turing.dom.get('#dom-test')[0],
        expected = element.currentStyle ? '#f5f5f5' : 'rgb(245, 245, 245)';

    turing.dom.css(element, { 'background-color': expected, 'width': 1000 });

    assert.equal(turing.dom.css(element, 'background-color'), expected);
    assert.equal(turing.dom.css(element, 'backgroundColor'), expected);
    assert.equal(turing.dom.css(element, 'width'), '1000px');
  },

  'test chained writing style properties': function() {
    var element = turing.dom.get('#dom-test')[0],
        expected = element.currentStyle ? '#f1f1f1' : 'rgb(241, 241, 241)';

    turing('#dom-test').css({ 'background-color': expected });

    assert.equal(turing('#dom-test').css('background-color'), expected);
    assert.equal(turing('#dom-test').css('backgroundColor'), expected);
  }
};

test.run(exports);
