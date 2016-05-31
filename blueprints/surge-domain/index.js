var fs = require('fs');
var path = require('path');

module.exports = {
  locals: function(options) {
    return {
      name: this.setupCname(options),
    };
  },

  setupCname: function(options) {
    var entityName = options.taskOptions.args[1];

    if(!entityName) {
      return this.surgedName(options.project.pkg.name);
    }

    if (!entityName.match(/\.\S*surge.sh/g)) {
      return this.surgedName(entityName);
    }

    return entityName;
  },

  surgedName: function(name) {
    return name + '.surge.sh';
  },

  normalizeEntityName: function() {
    // this prevents an error when the entityName is
    // not specified (since that doesn't actually matter to us
  }
}
