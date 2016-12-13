/**
 * Created by damian on 12/11/16.
 */
define(['vector'],function(vector) {

  // Makes a player at the specified position
  // vecPosition: A vector which is the starting position of the player
  function playerFactory(vecPosition){
    var newPlayer = {
      pos: vecPosition.plus(vector.vectorFactory(0, -0.5)),
      size: vector.vectorFactory(0.8, 1.5),
      speed: vector.vectorFactory(0,0),
      type: "player"
    };
    // setup some movement parameters
    var playerXSpeed = 7;
    var gravity = 30;
    var jumpSpeed = 17;

    // Moves the player left/right based on his keypress
    //  step: the size of the current timestep
    //  level: the level the player lives in
    //  keys: the keypresses
    // The step is used to fractionalize the size of the movement
    // If the player encounters an obstacle the level handles the collision
    newPlayer.moveX = function(step, level, keys) {
      // reset the speed, then set it to pos or neg based on left or right
      this.speed.x = 0;
      if (keys.left) {
        this.speed.x -= playerXSpeed;
      }
      if (keys.right) {
        this.speed.x += playerXSpeed;
      }
      // set the motion to be the speed in the X direction,
      // factored for the step
      var motion = vector.vectorFactory(this.speed.x * step, 0);
      // add the motion to the current position
      var newPos = this.pos.plus(motion);
      // if the player hits an obstacle then deal with it
      // otherwise let him move.
      var obstacle = level.obstacleAt(newPos, this.size);
      if (obstacle) {
        level.playerTouched(obstacle);
      }
      else {
        this.pos = newPos;
      }
    };
    // Moves the player up/down based on his keypress
    newPlayer.moveY = function(step, level, keys) {
      // gravity is always an influence.  Always move downward
      // effectively this means, even when standing still
      // that you'll always hit the floor.  This is by design
      this.speed.y += step * gravity;
      // make a vector for the amount to move in the Y direction
      var motion = vector.vectorFactory(0, this.speed.y * step);
      // calculate the new position based on this movement
      var newPos = this.pos.plus(motion);

      // You will almost always hit an obstacle unless
      // you're in the air falling/jumping
      // because we always have gravity pulling us down
      //  so the floor is beneath us
      var obstacle = level.obstacleAt(newPos, this.size);
      if (obstacle) {
        // level handles the collision
        level.playerTouched(obstacle);
        // you've collided with something (the floor)
        // and you're falling (gravity)
        // and you've pressed up
        // you want to jump
        if (keys.up && this.speed.y > 0){
          // Add the jumpspeed (negative is upwards)
          // without factoring for the step
          // this will be a 'large' value
          this.speed.y = -jumpSpeed;
        } else {
          // You're on the floor but didn't jump
          this.speed.y = 0;
        }
      } else {
        // move him, no obstacle
        this.pos = newPos;
      }
    };
    // handles the player's turn
    // moves him in x and y directions
    // processes any collisions
    // animates his death
    newPlayer.act = function(step, level, keys) {
      // run the X and Y moves
      newPlayer.moveX(step, level, keys);
      newPlayer.moveY(step, level, keys);

      // check for collision with other actor
      var otherActor = level.actorAt(newPlayer);
      if (otherActor) {
        // let the level handle the collision
        level.playerTouched(otherActor.type, otherActor);
      }

      // Losing animation
      if (level.status === 'lost') {
        // shrink the size of the player
        // when he dies
        newPlayer.pos.y += step;
        newPlayer.size.y -= step;
      }
    };


    return newPlayer;
  }

  // Makes lava at the specified position, character defines the different types of lava
  // vecPosition: A vector, the place to create the lava
  // character: A string character to identify the type of lava {'=','|','v'}
  function lavaFactory(vecPosition, character) {
    var newLava = {
      pos: vecPosition,
      size: vector.vectorFactory(1,1),
      speed: null,
      type: 'lava',
      repeatPos: null
    };

    // TODO: these mapping are hard coded.  They should be more dynamic
    switch (character){
      case '=': // horizontal moving lava
        newLava.speed = vector.vectorFactory(2, 0);
        break;
      case '|': // vertical moving lava
        newLava.speed = vector.vectorFactory(0, 2);
        break;
      case 'v': // dripping lava
        newLava.speed = vector.vectorFactory(0, 3);
        newLava.repeatPos = vecPosition;
        break;
      default:
        //TODO: Raise execption?
    }

    // move the lava.
    // lava either:
    //  progresses forward by a step
    //  returns to its start pos if repeatPos is set
    //  otherwise, bounces off a wall and heads backward
    newLava.act = function(step, level) {
      // The lava moves its speed * the size of the step
      var newPos = newLava.pos.plus(newLava.speed.times(step));
      // if there's no obstacle in the new position
      if (!level.obstacleAt(newPos, newLava.size)){
        // move the lava there
        newLava.pos = newPos;
      }
      // there's an obstacle but the lava is set to drip
      else if (newLava.repeatPos) {
        // move it back to the the start so it can drip again
        newLava.pos = newLava.repeatPos;
      }
      // otherwise it needs to bounce off and move back in the other dir
      else {
        newLava.speed = newLava.speed.times(-1);
      }
    };

    return newLava;
  }

  // Makes a coin at the specified position
  // vecPosition: A vector, the place to create the coin
  function coinFactory(vecPosition) {
    // animation control values
    var wobbleSpeed = 8;
    var wobbleDist = 0.07;

    var newCoin = {
      pos: vecPosition.plus(vector.vectorFactory(0.2, 0.1)),
      size: vector.vectorFactory(0.6, 0.6),
      wobble: Math.random() * Math.PI * 2,
      type: 'coin'
    };
    // set the base position to the start position of the coin
    newCoin.basePos = newCoin.pos;

    // animate the coin so it wobbles around up and down
    // It moves based on its wobble speed and the step size
    newCoin.act = function(step) {
      // for each step we need to wobble at the set speed
      newCoin.wobble += step * wobbleSpeed;
      // use sin to create a movement pattern
      var wobblePos = Math.sin(newCoin.wobble) * wobbleDist;
      // use the result of sin on the 'y' to move up and down
      newCoin.pos = newCoin.basePos.plus(vector.vectorFactory(0, wobblePos));
    };
    return newCoin;
  }

  return {
    playerFactory: playerFactory,
    coinFactory: coinFactory,
    lavaFactory: lavaFactory
  };

});