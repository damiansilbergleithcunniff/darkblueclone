define(['level', 'dom-drawing', 'keyboard', 'GAME_LEVELS'], function(level, drawing, keyboard, game_levels) {

  var scale = 20;
  var killSwitch = false;



  // Runs the animation by scheduling the next frame using requestAnimationFrame
  // frameFunc: a function that takes a timestep in seconds
  //              and returns true if animation is to continue
  //              and false if it is to cease
  function runAnimation(frameFunc) {
    // initialize, there is no previous time
    var lastTime = null;

    // function to run a single frame
    // called repeatedly by requestAnimationFrame
    function frame(time) {
      var stop = false;

      // if there is a lastTime then we need to calculate the step
      if (lastTime !== null) {
        // get the amount of time that has passed since last run
        //  (time - lastTime)
        //  which returns the diff in milliseconds
        // We set a maximum time of 100 milliseconds
        //  this prevents a large time frame (for example if the
        //  animation is paused or the browser is minimized)
        // Finally we convert the time frame into seconds
        //  so that it is easier to understand
        var timeStep = Math.min(time - lastTime, 100) / 1000;
        // if the frameFunc returns false
        //  or if the killSwitch is on
        // then it's time to stop
        stop = (frameFunc(timeStep) === false) || killSwitch;
      }
      // update the last time to now
      lastTime = time;

      // if we're still running, queue the next frame
      if (!stop) {
        requestAnimationFrame(frame);
      }
    }

    // queue up the first frame
    requestAnimationFrame(frame);
  }

  // Runs the specified level and calls andThen on completion
  // level: the level to run
  // displayFactory: a displayFactory used to render the level's view
  // keyboard: a key keyboard module
  // andThen: a function to call when the level is done
  function runLevel(level, displayFactory, keyboard, andThen) {
    keyboard.enableKeyboard();
    var trackedKeys = keyboard.trackedKeys();

    // make a display based on the level
    var display = displayFactory(document.body, level, scale);
    // run the animation with a frame func
    runAnimation(function(step) {
      // Iterate the level causing everybody to act
      // pass the keys that were pressed so that we can move if necessary
      level.animate(step, trackedKeys);
      // draw the update on the screen
      display.drawFrame(step);

      // if the level is done
      // call the andThen if necessary
      // and finally exit
      if (level.isFinished()) {
        keyboard.disableKeyboard();
        display.clear();
        if (andThen){
          andThen(level.status);
        }
        return false;
      }
  });
}

  // Runs a set of levels using the specified display factory
  // plans: array of levels
  // displayFactory: a displayFactory for rendering
  // keyboard: a keyboard module
  function runGame(plans, displayFactory, keyboard) {
    // function to start a level contained in the plans
    // n: the index of the level to start
    function startLevel(n) {
      // make the level from the plan at index n
      var currentLevel = level.levelFactory(plans[n]);
      // run the current level using the display factory and keyboard
      // when the level completes, call this function
      runLevel(currentLevel, displayFactory, keyboard, function(status) {
        // if you lose, repeat the level
        // otherwise if there are levels left, go to the next
        // otherwise you've finished all the levels, you win
        if (status === 'lost'){
          startLevel(n);
        } else if (n < plans.length - 1) {
          startLevel(n + 1);
        } else {
          win();
        }
      });
    }
    startLevel(0);
  }

  // function to handle the win state
  function win() {
    console.log('You win!');
  }
  // function to terminate while running
  var kill = function(){
    killSwitch = true;
  };


  function run() {
    var simpleLevelPlan = [
      '                      ',
      '                      ',
      '  x              = x  ',
      '  x         o o    x  ',
      '  x @      xxxxx   x  ',
      '  xxxxx            x  ',
      '      x!!!!!!!!!!!!x  ',
      '      xxxxxxxxxxxxxx  ',
      '                      '
    ];
    // runGame([simpleLevelPlan], drawing.displayFactory, keyboard);
    runGame(game_levels.plan, drawing.displayFactory, keyboard);
  }

  return {
    run: run,
    kill: kill
  };

});