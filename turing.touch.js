(function() {
  var touch = {};

  // Returns [orientation angle, orientation string]
  touch.orientation = function() {
    var orientation = window.orientation,
        orientationString = '';
    switch (orientation) {
      case 0:
        orientationString += 'portrait';
      break;

      case -90:
        orientationString += 'landscape right';
      break;

      case 90:
        orientationString += 'landscape left';
      break;

      case 180:
        orientationString += 'portrait upside-down';
      break;
    }
    return [orientation, orientationString];
  };

  // Multitouch?
  // http://developer.apple.com/safari/library/documentation/appleapplications/reference/safariwebcontent/HandlingEvents/HandlingEvents.html#//apple_ref/doc/uid/TP40006511-SW1

  turing.touch = touch;
})();

