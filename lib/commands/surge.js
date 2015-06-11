var path = require('path');
var fs = require('fs');


module.exports = {
  name: 'surge',
  description: 'Passes through commands to surge-cli.',

  projectPath: null,

  availableOptions: [
    // { name: 'project', type: String, aliases: ['p'], description: 'path to projects asset directory (./)' },
    // { name: 'domain', type: String, aliases: ['d'], description: 'domain of your project (<random>.surge.sh)' }
    // { name: 'endpoint', type: String, aliases: ['e'], description: "domain of API server (surge.sh)" }
  ],

  runCommand: function(command, args) {
    var RSVP    = require('rsvp');
    var Promise = RSVP.Promise;
    var spawn   = require('child_process').spawn;
    return new Promise(function(resolve, reject) {
      var child = spawn(command, args);
      var result = {
        output: [],
        errors: [],
        code: null
      };

      child.stdout.on('data', function (data) {
        var string = data.toString();

        console.log(string);

        result.output.push(string);
      });

      child.stderr.on('data', function (data) {
        var string = data.toString();

        console.error(string);

        result.errors.push(string);
      });

      child.on('close', function (code) {
        result.code = code;

        if (code === 0) {
          resolve(result);
        } else {
          reject(result);
        }
      });
    });
  },

  buildSurgeArgs: function(options, domainName){
    var surgeOptArgs = [ '--project', 'dist', '--domain', domainName];
    var possibleOptions = [];
    this.availableOptions.forEach(function(available){
      possibleOptions.push(available.name);
    });
    Object.keys(options).forEach(function(optionKey){
      if(possibleOptions.indexOf(optionKey) > -1){
        surgeOptArgs.push('--' + optionKey);
        surgeOptArgs.push(options[optionKey]);
      }
    });
    return surgeOptArgs;
  },

  cnameFile: function( file ) {
    return fs.readFileSync( file + '/CNAME', 'utf8');
  },

  copyIndex: function (path) {
    return fs.writeFileSync(path + '/dist/200.html', fs.readFileSync(path + '/dist/index.html'));
  },

  triggerBuild: function(commandOptions) {
    var BuildTask = this.tasks.Build;
    var buildTask = new BuildTask({
      ui: this.ui,
      analytics: this.analytics,
      project: this.project
    });

    this.projectPath = buildTask.project.root;

    commandOptions.environment = commandOptions.environment || 'production';
    commandOptions.outputPath = 'dist';
    return buildTask.run(commandOptions);
  },

  run: function (options) {
    var self = this;
    var command = path.join(__dirname, '..', '..', 'node_modules', 'surge', 'lib', 'cli.js');

    var domainName;
    var surgeArgs;

    return this.triggerBuild(options).then( function () {
      // copy index.html to 200.html to support real URLs, see https://surge.sh/help/adding-a-200-page-for-client-side-routing
      self.copyIndex(self.projectPath);

      domainName = self.cnameFile( self.projectPath );
      surgeArgs = self.buildSurgeArgs(options, domainName);

      return self.runCommand(command, surgeArgs);
    });
  }
};
