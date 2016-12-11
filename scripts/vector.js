/**
 * Created by damian on 12/11/16.
 */
define([],function() {
  var vector = function(x, y){
    var that = {
      x: x,
      y: y
    };

    that.plus = function(v) {
      return vector(this.x + v.x, this.y + v.y);
    };
    that.minus = function(v) {
      return vector(this.x - v.x, this.y - v.y);
    };
    that.length = function(v){
      var xdist = Math.abs(this.x);
      var ydist = Math.abs(this.y);
      var xsq = xdist * xdist;
      var ysq = ydist * ydist;
      return Math.sqrt(xsq + ysq);
    };

    return that;
  };

  return {
    vectorFactory: vector
  }
});
