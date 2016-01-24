/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-cli-page-object',

  afterInstall: function() {
    this.addBowerPackageToProject('ceibo', 'san650/ceibo#amd-module');
  },

  included: function(app) {
    this._super.included(app);

    if (app.env === 'test') {
      app.import(app.bowerDirectory + '/ceibo/index.js');
    }
  }
};
