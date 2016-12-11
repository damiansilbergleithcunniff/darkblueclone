define(['level'], function(level) {

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
    console.log(simpleLevel.width + ' by ' + simpleLevel.height);
  }

  return {
    run: run
  }

});