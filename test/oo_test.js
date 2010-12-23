require.paths.unshift('./turing-test/lib');

if (typeof turing === 'undefined')
  turing = require('../turing.core.js').turing;

require('../turing.oo.js');
require('../turing.functional.js');
require('../turing.enumerable.js');

var test = require('test'),
    assert = require('assert'),
    NoInitializer,
    Admin,
    Guest,
    User,
    MixinUser,
    DoubleMixinUser,
    SuperUser;

exports.testOO = {
  'test class setup': function() {
    NoInitializer = turing.Class({
      doSomething: function() { return 'something'; }
    });

    User = turing.Class({
      initialize: function(name, age) {
        this.name = name;
        this.age  = age;
      },

      display: function() {
        return this.name + ': ' + this.age;
      },

      login: function() {
        return true;
      },

      toString: function() {
        return "name: " + this.name + ", age: " + this.age;
      }
    });

    Admin = turing.Class(User, {
      dangerousMethod: function() {
        return 'danger!';
      }
    });

    Guest = turing.Class(User, {
      initialize: function(state) {
        this.name  = 'User_' + this.randomId();
        this.age   = 0;
        this.state = state;
      },

      randomId: function() {
        return Math.floor(Math.random() * 100);
      }
    });

    MixinUser = turing.Class({
      include: User,

      initialize: function(log) {
        this.log = log;
      }
    });

    DoubleMixinUser = turing.Class({
      include: [NoInitializer, User],

      initialize: function(log) {
        this.log = log;
      }
    });

    SuperUser = turing.Class(User, {
      initialize: function() {
        this.$super('initialize', arguments);
      },

      toString: function() {
        return "SuperUser: " + this.$super('toString');
      }
    });
  },

  'test classes with no initialize': function() {
    var noInit = new NoInitializer();
    assert.equal('something', noInit.doSomething());
  },

  'test instantiation': function() { 
    var alex = new User('Alex', 29);
    assert.equal('Alex', alex.name);
  },

  'test inheritance': function() {
    var admin = new Admin('Alex', 29),
        guest = new Guest('registering');

    assert.equal('Alex', admin.name);
    assert.equal('danger!', admin.dangerousMethod());
    assert.equal('registering', guest.state);
  },

  'test a class with mixins': function() {
    var mixinUser       = new MixinUser('log file'),
        doubleMixinUser = new DoubleMixinUser('double log file');

    assert.ok(mixinUser.login());
    assert.equal('log file', mixinUser.log);
    assert.equal('something', doubleMixinUser.doSomething());
  },

  'an inherited class that uses super': function() {
    var superUser = new SuperUser('alex', 104);
    assert.equal(104, superUser.age);
    assert.equal(104, superUser.age);
    assert.ok(superUser.toString().match(/SuperUser:/));
  }
};

test.run(exports);
