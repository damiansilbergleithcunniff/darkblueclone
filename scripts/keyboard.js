define([],function() {

  // the object that will, inevitably, be used to track keypresses
  var trackedKeys = null;
  
  // the set of valid keycodes
  var trackedCodes = {
    37: 'left', // leftArrow
    38: 'up',   // downArrow
    39: 'right' // rightArrow
  };

  // we need this at module scope so that we can remove it
  // in the disableKeyboard() function
  var keypressHandler;

  // Creates an object that tracks what keys are pressed
  // also wires up the keyup/keydown listeners
  // even though this looks like a factory
  // it should only be called once to prevent multiple
  // wireups
  // codes: an object that contains key codes as keys and strings as values
  //        these are the keycodes that will be tracked
  function setupTracking(codes) {
    var pressed = Object.create(null);

    // we define the function for handle keypresses
    // but we save it to function scope so that we can remove it later
    keypressHandler = function(event) {
      // check the codes object and see if it has a property
      // that matches the keycode
      // this works with objects like 'trackedCodes'
      if (codes.hasOwnProperty(event.keyCode)) {
        // This handler is only wired to keyup/keydown events
        //  so test the eventtype to see if it is keydown
        // true if it is, false if it isn't
        var down = (event.type === 'keydown');
        // record that the specified key is up or down
        pressed[codes[event.keyCode]] = down;
        // and block the default event (no key down or key up events)
        event.preventDefault();
      }
    };

    return pressed;
  }

  function enableKeyboard(){
    // setup tracking and save the tracker object so that it can be
    // exported from the module
    trackedKeys = setupTracking(trackedCodes);
    // add the keypress handler to the keyup and keydown events
    addEventListener('keydown', keypressHandler);
    addEventListener('keyup', keypressHandler);

  }

  function disableKeyboard(){
    removeEventListener('keydown', keypressHandler);
    removeEventListener('keyup', keypressHandler);
    trackedKeys = null;
  }


  return {
    enableKeyboard: enableKeyboard,
    disableKeyboard: disableKeyboard,
    trackedKeys: function() { return trackedKeys; }
  }

});