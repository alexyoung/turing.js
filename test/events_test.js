require.paths.unshift('./turing-test/lib');

if (typeof turing === 'undefined')
  turing = require('../turing.core.js').turing;

var test = require('test'),
    assert = require('assert');

require('../turing.dom.js');
require('../turing.events.js');

if (typeof document !== 'undefined') {
  exports.testEvents = {
    'test delegate handlers': function() {
      var clicks = 0;
      turing.events.delegate(document, '#events-test a', 'click', function(e) {
        clicks++;
      });

      turing.events.fire(turing.dom.get('#events-test a')[0], 'click');
      assert.equal(1, clicks, 'run the handler when the right selector is matched');

      turing.events.fire(turing.dom.get('p')[0], 'click');
      assert.equal(1, clicks, 'run the handler when the right selector is matched');
    },

    'test event lifecycle and chained events': function() {
      var element = turing.dom.get('#events-test a')[0],
          check = 0,
          clicks = 0,
          callback = function(e) { check++; return false; };

      turing.events.add(element, 'click', callback);
      turing.events.fire(element, 'click');
      turing.events.remove(element, 'click', callback);
      assert.equal(1, check, 'check should have been incremented once');

      turing('#events-test a').bind('click', function() { clicks++; });
      turing.events.fire(element, 'click');
      assert.equal(1, clicks, 'clicks should have been incremented once');
      
      check = 0;
      turing.events.add(element, 'click', callback);
      turing.events.fire(element, 'click');
      turing.events.remove(element, 'click', callback);
      turing.events.fire(element, 'click');
      assert.equal(1, check, 'check should have been increment once because the event handler was removed');
    },

    'test event stop and fire': function() {
        var lastResult = '',
            callback = function(event) { lastResult = event.target.innerHTML; };

      turing.events.add(document, 'click', callback);
      turing.events.fire(turing.dom.get('.clickme')[0], 'click');
      turing.events.remove(document, 'click', callback);
      assert.equal('Text', lastResult, 'set the correct element in event.target');

      var callback = function(event) { event.stop(); };
      turing.events.add(turing.dom.get('#link2')[0], 'click', callback);
      turing.events.fire(turing.dom.get('#link2')[0], 'click');
      assert.equal('', window.location.hash, 'event.stop() should have stopped the event');
    }
  };
}

exports.testEventEmitter = {
  'test addListener': function() {
    var Emitter = turing.events.Emitter,
        emitter = new Emitter(),
        i = 0;
    
    emitter.on('eventName', function() {
      i++;
    });

    emitter.on('testFired', function() {
      assert.equal(i, 1);
    });

    assert.ok(emitter.emit('eventName'));
    assert.ok(emitter.emit('testFired'));
  },

  'test removeAllListeners': function() {
    var Emitter = turing.events.Emitter,
        emitter = new Emitter();
    
    emitter.on('event1', function() {});
    emitter.on('event2', function() {});

    emitter.removeAllListeners('event1');
  
    assert.ok(!emitter.emit('event1'));
    assert.ok(emitter.emit('event2'));
  },

  'test removeListener': function() {
    var Emitter = turing.events.Emitter,
        emitter = new Emitter(),
        i = 0;
    
    function add() {
      i++;
    }

    function nothing() {
    }

    emitter.on('add', add);
    emitter.on('add', nothing);
    emitter.on('testFired', function() {
      assert.equal(i, 1);
    });

    assert.ok(emitter.emit('add'));
    assert.ok(emitter.removeListener('add', add));
    assert.ok(emitter.emit('add'));
    assert.ok(emitter.removeListener('add', nothing));
    assert.ok(!emitter.removeListener('add', nothing));
    assert.ok(!emitter.emit('add'));
    assert.ok(emitter.emit('testFired'));
  },

  'test listener removal in Emitter': function() {
    var Emitter = turing.events.Emitter,
        emitter = new Emitter(),
        i = 0,
        j = 0;
    
    function add() {
      i++;
      assert.ok(emitter.removeListener('add', add));
    }

    // This should end up being called twice
    function add2() {
      j++;
    }

    emitter.on('add', add);
    emitter.on('add', add2);

    assert.ok(emitter.emit('add'));
    assert.ok(!emitter.removeListener('add', add));
    assert.ok(emitter.emit('add'));
    assert.equal(2, j);
  }
};

test.run(exports);
