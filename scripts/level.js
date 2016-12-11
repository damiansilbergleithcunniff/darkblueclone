/**
 * Created by damian on 12/11/16.
 */
define(['vector', 'actor'], function(vector, actor){

  var spaceMap = {
    'x': 'wall',
    '!': 'lava'
  };
  var actorChars = {
    '@': actor.playerFactory,
    'o': actor.coinFactory,
    '=': actor.lavaFactory,
    '|': actor.lavaFactory,
    'v': actor.lavaFactory
  };

  // Makes a level object using the plan as the layout for the level
  // parameters:
  //  plan: array of arrays
  function levelFactory(plan) {

    //TODO: Validate the plan

    var newLevel = {
      width: plan[0].length,
      height: plan.length,
      grid: [],
      actors: [],
      status: null,
      finishDelay: null
    };
    newLevel.isFinished = function() {
      return newLevel.status !== null && newLevel.finishDelay < 0;
    };

    // for each row in the plan
    for (var y = 0; y < newLevel.height; y++) {
      var line = plan[y];
      // each gridline is a line on the screen
      // it contains null for empty safe space
      // or it contains something from the spaceMap (lava or wall)
      var gridLine = [];
      // for each cell in the row
      for (var x = 0; x < newLevel.width; x++) {
        var cellContent = line[x];
        var fieldType = null;
        var actorFactory = actorChars[cellContent];

        // if there's an actor
        if (actorFactory) {
          // create him based on his factory function
          // and add him to the list of actors
          var gridPoint = vector.vectorFactory(x, y);
          var newActor = actorFactory(gridPoint, cellContent);
          newLevel.actors.push(newActor);
        } else { // otherwise, there was no actor so there is space
          // check to see if the character is in our spaceMap
          // if it is we use that for the field
          // otherwise assume null for the field
          fieldType = spaceMap[cellContent] || null;
        }
        // if there was an actor in the position then the field is empty
        gridLine.push(fieldType);
      }
      // push the line onto the grid
      newLevel.grid.push(gridLine);
    }

    // set the player to the player actor.  There should be only 1
    // this is done after all the actors and level information is loaded
    // to set a static property on the level
    newLevel.player = newLevel.actors.filter(function(actor) {
      return actor.type === 'player';
    })[0];

    return newLevel;
  }

  return {
    levelFactory: levelFactory
  }
});