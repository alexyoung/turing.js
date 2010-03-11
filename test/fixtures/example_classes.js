var NoInitializer = turing.Class({
  doSomething: function() { return 'something'; }
});

var User = turing.Class({
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

var Admin = turing.Class(User, {
  dangerousMethod: function() {
    return 'danger!';
  }
});

var Guest = turing.Class(User, {
  initialize: function(state) {
    this.name  = 'User_' + this.randomId();
    this.age   = 0;
    this.state = state;
  },

  randomId: function() {
    return Math.floor(Math.random() * 100);
  }
});

var MixinUser = turing.Class({
  include: User,

  initialize: function(log) {
    this.log = log;
  }
});

var DoubleMixinUser = turing.Class({
  include: [NoInitializer, User],

  initialize: function(log) {
    this.log = log;
  }
});

var SuperUser = turing.Class(User, {
  initialize: function() {
    this.super('initialize', arguments);
  },

  toString: function() {
    return "SuperUser: " + this.super('toString');
  }
});
