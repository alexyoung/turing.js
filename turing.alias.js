(function() {
  turing.aliasFramework = function() {
    var alias = function() {
      return turing(arguments[0]);
    }

    if (turing.enumerable) {
      turing.enumerable.each(turing.enumerable, function(fn, method) {
        alias[method] = fn;
      });
    }

    if (turing.dom) {
      alias.dom = turing.dom;
    }

    if (turing.events) {
      alias.events = turing.events;
    }

    return alias;
  };

  turing.exportAlias(turing.alias, turing.aliasFramework);
})();
