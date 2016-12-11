/**
 * Created by damian on 12/11/16.
 */
define([], function () {

  // makes a dom element with a class applied
  function domFactory(name, className) {
    var elt = document.createElement(name);
    if (className) {
      elt.className = className;
    }
    return elt;
  }

  function domDisplayFactory(parent, level, scale) {
    var domDisplay = {
      wrap: parent.appendChild(domFactory('div', 'game')),
      level: level,
      actorLayer: null,
      scale: scale || 20
    };

    // Draws the background <table> element with rows and columns for each space on the grid
    domDisplay.drawBackground = function() {
      // use a table for the background
      var table = domFactory('table', 'background');
      // set the width to be the width of the level, scaled
      table.style.width = domDisplay.level.width * domDisplay.scale + 'px';
      // iterate through the rows of the grid
      domDisplay.level.grid.forEach(function(row) {
        // make a tr for the row
        var rowElt = table.appendChild(domFactory('tr'));
        // set the height to be 1 scale unit high
        rowElt.style.height = domDisplay.scale + 'px';
        // iterate through the cells in the row
        row.forEach(function(type) {
          // make a td for each one and set the class to be whatever the 'type' is on the cell content
          rowElt.appendChild(domFactory('td', type));
        });
      });

      return table;
    };

    // draws a single frame by clearing the actorLayer and re-rendering it
    domDisplay.drawFrame = function () {
      // if there's an actor layer in the display
      if (domDisplay.actorLayer){
        // remove it from the wrapping element
        domDisplay.wrap.removeChild(domDisplay.actorLayer);
      }
      // make a new actorLayer, appending it to the wrapper
      domDisplay.actorLayer = domDisplay.wrap.appendChild(domDisplay.drawActors());
      // make sure the wrapper has the game class on it, and if there is a status use it
      domDisplay.wrap.className = 'game ' + (domDisplay.level.status || '');
      // recenter the view on the player
      domDisplay.scrollPlayerIntoView();
    };

    // draws all the actors inside a single div
    domDisplay.drawActors = function() {
      // wrap the element we create in a div
      var wrap = domFactory('div');
      // loop through the actors in the level
      domDisplay.level.actors.forEach(function(actor) {
        // make div inside the wrapper for the actor and give it 2 classes for style 'actor'
        // and whatever the actor type is
        // ie: class='actor player' or class='actor lava'
        var rect = wrap.appendChild(domFactory('div','actor ' + actor.type));
        // set the width and height based on the actor's size, scaled for our display
        rect.style.width = actor.size.x * domDisplay.scale + 'px';
        rect.style.height = actor.size.y * domDisplay.scale + 'px';
        // set the position of the actor based on his position, scaled for our display
        rect.style.left = actor.pos.x * domDisplay.scale + 'px';
        rect.style.top = actor.pos.y * domDisplay.scale + 'px';
      });

      return wrap;
    };

    // moves the player into view by setting the
    // scroll position on the wrapping element
    // Builds a margin in so the view doesn't scroll
    // on every move.
    domDisplay.scrollPlayerIntoView = function() {
      var width = domDisplay.wrap.clientWidth;
      var height = domDisplay.wrap.clientHeight;
      // we create a margin (1/3 of the width) that the player can move
      // around in without scrolling the viewport
      var margin = width / 3;

      // The viewport
      var left = domDisplay.wrap.scrollLeft;
      var top = domDisplay.wrap.scrollTop;
      var right = left + width;
      var bottom = top + height;

      var player = domDisplay.level.player;
      var center = player.pos.plus(player.size.times(0.5)).times(domDisplay.scale);

      // if the player's center is past the left side
      if (center.x < left + margin){
        // scroll the wrapper to the left
        domDisplay.wrap.scrollLeft = center.x - margin;
      }
      // if the player's center is too far to teh right
      else if (center.x > right - margin) {
        // scroll the wrapper back to the right
        domDisplay.wrap.scrollLeft = center.x + margin - width;
      }

      if (center.y < top + margin) {
        domDisplay.wrap.scrollTop = center.y - margin;
      }
      else if (center.y > bottom - margin){
        domDisplay.wrap.scrollTop = center.y + margin - height;
      }

    };

    // removes the wrapping div from its parent
    domDisplay.clear = function() {
      domDisplay.wrap.parentNode.removeChild(domDisplay.wrap);
    };

    domDisplay.wrap.appendChild(domDisplay.drawBackground());
    domDisplay.actorLayer = null;
    domDisplay.drawFrame();
  }

  return {
    displayFactory: domDisplayFactory
  };
});