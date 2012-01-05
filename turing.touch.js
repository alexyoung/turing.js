/*!
 * Turing Touch
 * Copyright (C) 2010-2011 Alex R. Young
 * MIT Licensed
 */

/**
 * Support for touchscreen devices.  Run `turing.touch.register()` to get touch event support.
 *
 * Tap:
 *
 *     turing.events.add(element, 'tap', function(e) {
 *       alert('tap');
 *     });
 *
 * Swipe:
 *
 *     turing.events.add(element, 'swipe', function(e) {
 *       alert('swipe');
 *     });
 *
 * Orientation Changes:
 *
 * Device orientation is available in `turing.touch.orientation()`.
 *
 *     turing.events.add(element, 'orientationchange', function(e) {
 *       alert('Orientation is now: ' + turing.touch.orientation());
 *     });
 */
define('turing.dom', ['turing.core', 'turing.dom', 'turing.events'], function(turing, dom, events) {
  var touch = {}, state = {};

  touch.swipeThreshold = 50;

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

  function touchStart(e) {
    state.touches = e.touches;
    state.startTime  = (new Date).getTime();
    state.x = e.changedTouches[0].clientX;
    state.y = e.changedTouches[0].clientY;
    state.startX = state.x;
    state.startY = state.y;
    state.target = e.target;
    state.duration = 0;
  }

  function touchEnd(e) {
    var x = e.changedTouches[0].clientX,
        y = e.changedTouches[0].clientY;

    if (state.x === x && state.y === y && state.touches.length == 1) {
      turing.events.fire(e.target, 'tap');
    }
  }

  function touchMove(e) {
    var moved = 0, touch = e.changedTouches[0];
    state.duration = (new Date).getTime() - state.startTime;
    state.x = state.startX - touch.pageX;
    state.y = state.startY - touch.pageY;
    moved = Math.sqrt(Math.pow(Math.abs(state.x), 2) + Math.pow(Math.abs(state.y), 2));

    if (state.duration < 1000 && moved > turing.touch.swipeThreshold) {
      turing.events.fire(e.target, 'swipe');
    }
  }

  // register must be called to register for touch event helpers
  touch.register = function() {
    turing.events.add(document, 'touchstart', touchStart);
    turing.events.add(document, 'touchmove', touchMove);
    turing.events.add(document, 'touchend', touchEnd);
    turing.touch.swipeThreshold = screen.width / 5;
  };

  turing.touch = touch;
  return turing.touch;
});
