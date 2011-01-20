/*!
 * Turing OO
 * Copyright (C) 2010-2011 Alex R. Young
 * MIT Licensed
 */

/**
 * The Turing Class:
 * 
 *     User = turing.Class({
 *       initialize: function(name, age) {
 *         this.name = name;
 *         this.age  = age;
 *       }
 *     });
 *
 *     new User('Alice', '26');
 *
 * Inheritance:
 *
 * Pass an object to `turing.Class` to inherit from it.
 *
 *     SuperUser = turing.Class(User, {
 *       initialize: function() {
 *         this.$super('initialize', arguments);
 *       },
 *
 *       toString: function() {
 *         return "SuperUser: " + this.$super('toString');
 *       }
 *     });
 *
 * Mixins: 
 * 
 * Objects can be embedded within each other:
 *
 *     MixinUser = turing.Class({
 *       include: User,
 *
 *       initialize: function(log) {
 *         this.log = log;
 *       }
 *     });
 *
 **/
turing.Class = function() {
  return turing.oo.create.apply(this, arguments);
}

turing.oo = {
  create: function() {
    var methods = null,
        parent  = undefined,
        klass   = function() {
          this.$super = function(method, args) { return turing.oo.$super(this.$parent, this, method, args); };
          this.initialize.apply(this, arguments);
        };

    if (typeof arguments[0] === 'function') {
      parent = arguments[0];
      methods = arguments[1];
    } else {
      methods = arguments[0];
    }

    if (typeof parent !== 'undefined') {
      turing.oo.extend(klass.prototype, parent.prototype);
      klass.prototype.$parent = parent.prototype;
    }

    turing.oo.mixin(klass, methods);
    turing.oo.extend(klass.prototype, methods);
    klass.prototype.constructor = klass;

    if (!klass.prototype.initialize)
      klass.prototype.initialize = function(){};

    return klass;
  },

  mixin: function(klass, methods) {
    if (typeof methods.include !== 'undefined') {
      if (typeof methods.include === 'function') {
        turing.oo.extend(klass.prototype, methods.include.prototype);
      } else {
        for (var i = 0; i < methods.include.length; i++) {
          turing.oo.extend(klass.prototype, methods.include[i].prototype);
        }
      }
    }
  },

  extend: function(destination, source) {
    for (var property in source)
      destination[property] = source[property];
    return destination;
  },
  $super: function(parentClass, instance, method, args) {
    return parentClass[method].apply(instance, args);
  }
};
