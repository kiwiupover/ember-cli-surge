'use strict';

const path = require('path');

module.exports = {
  name: require('./package').name

  includedCommands: function() {
    return {
      'surge': require('./lib/commands/surge')
    };
  },

  blueprintsPath: function() {
    return path.join(__dirname, 'blueprints');
  }
};
