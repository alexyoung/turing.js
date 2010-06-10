(function() {
  var anim = {};

  function parseCSSValue(value) {
    var n = parseFloat(value);
    return { number: n, units: value.replace(n, '') };
  }

  anim.animate = function(element, duration, properties, options) {
    var duration = duration,
        start = (new Date).valueOf(),
        finish = start + duration,
        interval;

    for (var property in properties) {
      if (properties.hasOwnProperty(property)) {
        properties[property] = parseCSSValue(properties[property]);
      }
    }

    interval = setInterval(function() {
      var time = (new Date).valueOf(), position = time > finish ? 1 : (time - start) / duration;

      for (var property in properties) {
        if (properties.hasOwnProperty(property)) {
          element.style[property] = position * properties[property].number + properties[property].units;
        }
      }

      if (time > finish) {
        clearInterval(interval);
      }
    }, 10);
  }

  turing.anim = anim;
})();

