define(['level', 'dom-drawing'], function(level, drawing) {

  // Todo: review this function
  function runAnimation(frameFunc) {
    var lastTime = null;
    function frame(time) {
      var stop = false;
      if (lastTime != null) {
        var timeStep = Math.min(time - lastTime, 100) / 1000;
        stop = frameFunc(timeStep) === false;
      }
      lastTime = time;
      if (!stop)
        requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

    function run() {
    console.log('running');

    var simpleLevelPlan = [
      "                      ",
      "                      ",
      "  x              = x  ",
      "  x         o o    x  ",
      "  x @      xxxxx   x  ",
      "  xxxxx            x  ",
      "      x!!!!!!!!!!!!x  ",
      "      xxxxxxxxxxxxxx  ",
      "                      "
    ];

    var simpleLevel = level.levelFactory(simpleLevelPlan);
    var display = drawing.displayFactory(document.body, simpleLevel, 40);
    var arrows;
    // todo: review this as wellg
    runAnimation(function(step) {
      simpleLevel.animate(step, arrows);
      display.drawFrame(step);
      if (simpleLevel.isFinished()) {
        display.clear();
        if (andThen)
          andThen(simpleLevel.status);
        return false;
      }
    });

    }

  return {
    run: run
  }

});