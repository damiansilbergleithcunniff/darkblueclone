define([],function() {

  // the object that will, inevitably, be used to track keypresses
  var trackedKeys = null;
  
  // the set of valid keycodes
  var trackedCodes = {
    37: 'left',   // leftArrow
    38: 'up',     // downArrow
    39: 'right',  // rightArrow
    27: 'pause',  // escape

    40: 'down',   // down
    66: 'b',      // b
    65: 'a'       // a
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

  function pauseHandler(e) {
    if(trackedCodes[e.keyCode] === 'pause'){
      // toggle the is paused flag on the tracked keys object
      trackedKeys.isPaused = !trackedKeys.isPaused;
    }
  }

  // function to call on konamiSuccess
  var konamiSuccessCallback = null;
  var konamiKeySequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
  var currentKeySequence = [];
  function konami(e){
    currentKeySequence.push(e.keyCode);
    if (konamiSuccessCallback){
      for( var i = 0; i < currentKeySequence.length; i++){
        if (currentKeySequence[i] !== konamiKeySequence[i]){
          // reset the key sequence so the user can start again
          currentKeySequence = [];
          return null
        }
      }
      // all keys matched and the length of the array is the same
      // then we've got a match
      if (konamiKeySequence.length === currentKeySequence.length){
        konamiSuccessCallback();
      }
    }
  }

  function enableKeyboard(onKonamiSuccess){
    // setup tracking and save the tracker object so that it can be
    // exported from the module
    trackedKeys = setupTracking(trackedCodes);
    // add the keypress handler to the keyup and keydown events
    addEventListener('keydown', keypressHandler);
    addEventListener('keyup', keypressHandler);
    addEventListener('keyup', pauseHandler);
    if(onKonamiSuccess){
      konamiSuccessCallback = onKonamiSuccess;
      addEventListener('keyup', konami);
    }
  }

  function disableKeyboard(){
    removeEventListener('keydown', keypressHandler);
    removeEventListener('keyup', keypressHandler);
    removeEventListener('keyup', pauseHandler);
    removeEventListener('keyup', konami);
    trackedKeys = null;
  }


  return {
    enableKeyboard: enableKeyboard,
    disableKeyboard: disableKeyboard,
    trackedKeys: function() { return trackedKeys; }
  }

});