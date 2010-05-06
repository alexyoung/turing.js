turing.aliasFramework = function() {
  var alias = function() {
    if (typeof arguments[0] === 'string' && turing.dom) {
      return turing.dom.get(arguments[0]);
    } else {
      return turing;
    }
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

$t = turing.aliasFramework();
