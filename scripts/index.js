/**
 * Created by damian on 12/11/16.
 */
requirejs.config = {
  baseUrl: 'scripts',
  paths: {

  }
};

requirejs(['app'], function(app) {
  app.run();
});