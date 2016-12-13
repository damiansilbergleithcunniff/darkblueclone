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

    var maxStep = 0.5;

    // The level is finished if the status is set
    // and the finishDelay has expired
    newLevel.isFinished = function() {
      return newLevel.status !== null && newLevel.finishDelay < 0;
    };

    // determines if there is an obstacle at the stated pos
    //  obstacles are only non-empty cells (not actors)
    //  returns the fieldType that is in the target spot
    //  or null if it's empty
    // pos: vector with position of the actor
    // size: vector with the size of the actor
    newLevel.obstacleAt = function(pos, size) {
      // determine a bounding box around the
      // actor to define the space for possible
      // collisions
      var xStart = Math.floor(pos.x);
      var xEnd = Math.ceil(pos.x + size.x);
      var yStart = Math.floor(pos.y);
      var yEnd = Math.ceil(pos.y + size.y);

      // if you're off the map, then wall
      if (xStart < 0 || xEnd > newLevel.width || yStart < 0){
        return 'wall';
      }
      // unless you're off the bottom, then lava... DIE!
      if (yEnd > newLevel.height){
        return 'lava';
      }

      // step through the cells in the bounding box
      for (var y = yStart; y < yEnd; y++) {
        for (var x = xStart; x < xEnd; x++) {
          // check the current cell to see if it has something in it
          var fieldType = newLevel.grid[y][x];
          // if there's something there
          if (fieldType) {
            // return the first one we encounter
            return fieldType;
          }
        }
      }
      // otherwise return null
    };

    // scan the array of actors and see if any overlap the argument actor
    // actor: An actor in the game
    newLevel.actorAt = function(actor) {
      // loop through each of the actors in the level
      for (var i = 0; i < newLevel.actors.length; i++) {
        var other = newLevel.actors[i];
        // if the other actor isn't me
        // and the actor is in the other's bounding box
        if (other !== actor &&
          actor.pos.x + actor.size.x > other.pos.x &&
          actor.pos.x < other.pos.x + other.size.x &&
          actor.pos.y + actor.size.y > other.pos.y &&
          actor.pos.y < other.pos.y + other.size.y) {
          // then the other is our collision
          return other;
        }
      }
    };

    // Process collisions
    //  If you hit lava you die, if you collect the last coin you win
    // type: the type of object collided with
    // actor: if specified, the actor that was collided with
    newLevel.playerTouched = function(type, actor) {
      // if you collided with lava and the game isn't over
      if (type === 'lava' && newLevel.status === null) {
        // you dead baby
        newLevel.status = 'lost';
        newLevel.finishDelay = 1;
      } else if (type === 'coin') { // otherwise if you've hit a coin
        // filter the actors to remove the coin that was hit
        newLevel.actors = newLevel.actors.filter(function(other) {
          return other !== actor;
        });
        // if there aren't any coins left in the actor array
        if (!newLevel.actors.some(function(actor) {
            return actor.type === 'coin';
          })) {
          // you won!
          newLevel.status = 'won';
          newLevel.finishDelay = 1;
        }
      }
    };

      // Gives all actors in the level a chance to move
    // step: the time step, in seconds
    // keys: the arrow keys the player has pressed
    newLevel.animate = function(step, keys) {
      // if the game is won/lost
      if (newLevel.status !== null) {
        // count down to the final end
        newLevel.finishDelay -= step;
      }

      // slice the step into chunks
      // each of which is no larger than maxStep
      // On each microStep allow the actors to act
      while (step > 0) {
        // Each microStep is either the size of
        // a max step, or the remainder in the final step
        var microStep = Math.min(step, maxStep);
        // iterate through the actors
        newLevel.actors.forEach(function(actor) {
          // and let each one act
          actor.act(microStep, newLevel, keys);
        });
        // remove one microStep from the remain step
        step -= microStep;
      }
    };




    // Initialize the grid based on the plan
    // populate the grid with actors (player, coin, lava)
    // and fields (walls, and lava)
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

    // set the player attribute of the level to the player actor.
    // There should be only 1
    // newLevel is done after all the actors and level information is loaded
    // to set a static property on the level
    newLevel.player = newLevel.actors.filter(function(actor) {
      return actor.type === 'player';
    })[0];

    // return the level we created
    return newLevel;
  }

  return {
    levelFactory: levelFactory
  }
});