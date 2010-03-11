load('riot.js');
Riot.require('../turing.core.js');
Riot.require('../turing.oo.js');
Riot.require('fixtures/example_classes.js');  

Riot.context('turing.oo.js', function() {
  given('a class with no initializer', function() {
    var noInit = new NoInitializer();
    should('still do something', noInit.doSomething()).equals('something');
  });

  given('simple classes', function() {
    var alex = new User('Alex', 29);
    should('have instantiated a new object correctly', alex.name).equals('Alex');
  });

  given('a class that inherits', function() {
    var admin = new Admin('Alex', 29),
        guest = new Guest('registering');

    should('have instantiated a new object correctly', admin.name).equals('Alex');
    should('have its own methods', admin.dangerousMethod()).equals('danger!');
    should('execute its own initializer', guest.state).equals('registering');
  });

  given('a class with mixins', function() {
    var mixinUser       = new MixinUser('log file'),
        doubleMixinUser = new DoubleMixinUser('double log file');

    should('has expected properties ', mixinUser.login());
    should('use its own initializer', mixinUser.log).equals('log file');
    should('allow multiple mixins', doubleMixinUser.doSomething()).equals('something');
  });

  given('an inherited class that uses super', function() {
    var superUser = new SuperUser('alex', 104);
    should('run super() for initialize', superUser.age).equals(104);
    should('run super() for other methods', superUser.toString()).matches(/SuperUser:/);
  });
});

Riot.run();
