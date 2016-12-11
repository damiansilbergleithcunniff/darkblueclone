define(['level', 'dom-drawing'], function(level, drawing) {

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
    drawing.displayFactory(document.body, simpleLevel, 20);
  }

  return {
    run: run
  }

});