/* jshint node: true */
'use strict';

var path = require('path');

module.exports = {
  name: 'ember-cli-surge',

  includedCommands: function() {
    return {
      'surge': require('./lib/commands/surge')
    };
  },

  blueprintsPath: function() {
    return path.join(__dirname, 'blueprints');
  }
};
