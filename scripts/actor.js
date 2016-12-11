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
      type: 'lava'
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

    return newLava;
  }

  // Makes a coin at the specified position
  // vecPosition: A vector, the place to create the coin
  function coinFactory(vecPosition) {
    var newCoin = {
      pos: vecPosition.plus(vector.vectorFactory(0.2, 0.1)),
      size: vector.vectorFactory(0.6, 0.6),
      basePos: this.pos,
      wobble: Math.random() * Math.PI * 2,
      type: 'coin'
    };

    return newCoin;
  }

  return {
    playerFactory: playerFactory,
    coinFactory: coinFactory,
    lavaFactory: lavaFactory
  };

});