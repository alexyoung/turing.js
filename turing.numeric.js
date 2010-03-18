turing.numeric = {
  isNumber: function(object) {
    return (object === +object) || (toString.call(object) === '[object Number]');
  }
};

