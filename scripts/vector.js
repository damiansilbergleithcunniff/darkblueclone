/**
 * Created by damian on 12/11/16.
 */
define([],function() {
  var vectorFactory = function(x, y){
    var newVector = {
      x: x,
      y: y
    };

    newVector.plus = function(v) {
      return vectorFactory(newVector.x + v.x, newVector.y + v.y);
    };
    newVector.minus = function(v) {
      return vectorFactory(newVector.x - v.x, newVector.y - v.y);
    };
    newVector.times = function(factor) {
      return vectorFactory(newVector.x * factor, newVector.y * factor);
    };
    newVector.length = function(v){
      var xdist = Math.abs(newVector.x);
      var ydist = Math.abs(newVector.y);
      var xsq = xdist * xdist;
      var ysq = ydist * ydist;
      return Math.sqrt(xsq + ysq);
    };

    return newVector;
  };

  return {
    vectorFactory: vectorFactory
  }
});
