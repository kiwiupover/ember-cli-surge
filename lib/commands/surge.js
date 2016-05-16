var path      = require('path');
var fs        = require('fs');
var Surge     = require('surge');
var includes  = require('lodash/includes');
var remove    = require('lodash/remove');
var RSVP      = require('rsvp');

var surge = new Surge;
var hooks = {}

hooks.preAuth = function (req, next) {

  if (req.authed) {

    // Here, if the user is already authenticated, we’re saying hello.
    console.log('    Hello ' + req.creds.email + '!')
  } else {

    // If you’re not logged in yet, hi!
    console.log('    Login to surge.sh!')
  }
  console.log('')
  next()
}

module.exports = {
  name: 'surge',
  description: 'Deploy your ember app to surge.sh.',

  projectPath: null,

  availableOptions: [
    { name: 'login', type: String, aliases: ['l'], description: 'Login to your account at Surge (surge.sh)' },
    { name: 'whoami', type: String, aliases: ['w'], description: 'Check who you are logged in as.' },
    { name: 'publish', type: String, aliases: ['p'], description: 'Publishes a project to the web using Surge.' },
    { name: 'list', type: String, aliases: ['ls'], description: 'List all the projects you’ve published on Surge (surge.sh)' },
    { name: 'logout', type: String, description: 'Log out of your account at Surge (surge.sh)' }
  ],

  runCommand: function(command, args) {
    var Promise = RSVP.Promise;
    return new Promise(function(resolve, reject) {

      command(args);

      var result = {
        output: [],
        errors: [],
        code: null
      };

      process.on('close', function (code) {
        result.code = code;

        if (code === 0) {
          resolve(result);
        } else {
          reject(result);
        }
      });
    });
  },

  cnameFile: function( file ) {
    return fs.readFileSync( file + '/CNAME', 'utf8');
  },

  copyIndex: function ( path ) {
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

  buildAndPublish: function(options, args){
    var self = this;
    var domainName;

    return this.triggerBuild(options).then( function () {

      // copy index.html to 200.html to support real URLs,
      // see https://surge.sh/help/adding-a-200-page-for-client-side-routing
      self.copyIndex(self.projectPath);

      domainName = self.cnameFile( self.projectPath );

      [ '--project', 'dist', '--domain', domainName ].forEach(function(arg) {
        args.push(arg);
      });

      return self.runCommand(surge.publish(hooks), args);
    });
  },

  run: function (options) {
    var args = process.argv;

    if(args.length === 3 || includes(args, '--publish') || includes(args, '-p')) {
      args = remove(args, ['--publish', '-p']);
      return this.buildAndPublish(options, args);
    }

    if (includes(args, '--whoami') || includes(args, '-w')) {
      args = remove(args, ['--whoami', '-w']);
      return this.runCommand(surge.whoami(hooks), args);
    }

    if (includes(args, '--list') || includes(args, '-ls')) {
      args = remove(args, ['--list', '-ls']);
      return this.runCommand(surge.list(hooks), args);
    }

    if (includes(args, '--login') || includes(args, '-l')) {
      args = remove(args, ['--login', '-l']);
      return this.runCommand(surge.login(hooks), args);
    }

    if (includes(args, '--logout')) {
      args = remove(args, '--logout');
      return this.runCommand(surge.logout(hooks), args);
    }
  }
};
