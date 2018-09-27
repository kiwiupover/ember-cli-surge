const path      = require('path');
const fs        = require('fs');
const Surge     = require('surge');
const RSVP      = require('rsvp');
const Command   = require('ember-cli/lib/models/command');

let surge = new Surge;
let hooks = {};

hooks.preAuth = function(req, next) {
  if (req.authed) {
    // Here, if the user is already authenticated, we’re saying hello.
    console.log('    Hello ' + req.creds.email + '!');
  } else {
    // If you’re not logged in yet, hi!
    console.log('    Login to surge.sh!');
  }
  console.log('');
  next();
};

module.exports = Command.extend({
  name: 'surge',
  description: 'Deploy your ember app to surge.sh.',

  projectPath: null,

  availableOptions: [
    { name: 'login', type: String, aliases: ['l'], default: false, description: 'Login to your account at Surge (surge.sh)' },
    { name: 'whoami', type: String, aliases: ['w'], default: false, description: 'Check who you are logged in as.' },
    { name: 'list', type: String, aliases: ['ls'], default: false, description: 'List all the projects you’ve published on Surge (surge.sh)' },
    { name: 'token', type: String, aliases: ['t'], default: false, description: 'Get surge.sh authentication token, great for Continuous Integration (CI)' },
    { name: 'new-domain', type: String, aliases: ['d'], default: false, description: 'Add your own domain name ie: `--new-domain="kiwis.surge.sh"` \n                                     or (surge.sh) will generate a domain when no argumentment is passed in ie:`--new-domain`' },
    { name: 'logout', type: String, default: false, description: 'Log out of your account at Surge (surge.sh)' },
    { name: 'publish', type: String, aliases: ['p'], default: true, description: 'Publishes a project to the web using Surge.' },
    { name: 'environment', type: String, aliases: ['e'], default: 'production', description: 'The ember env you want deployed default (production).' },
    { name: 'teardown', type: String, aliases: ['td'], default: false, description: 'Tear down a published project.' }
  ],

  runCommand(command, args) {
    return new RSVP.Promise((resolve, reject) => {
      surge[command](hooks)(args);

      let result = {
        code: null
      };

      process.on('exit', code => {
        result.code = code;

        if (code === 0) {
          resolve(result);
        } else {
          reject(result);
        }
      });
    });
  },

  cnameFile(path) {
    let file;
    if (fs.existsSync(path + '/CNAME')) {
      file = fs.readFileSync(path + '/CNAME', 'utf8');
    }
    return file;
  },

  copyIndex(path) {
    return fs.writeFileSync(path + '/dist/200.html', fs.readFileSync(path + '/dist/index.html'));
  },

  triggerBuild(commandOptions) {
    let buildTask = new this.tasks.Build({
      ui: this.ui,
      analytics: this.analytics,
      project: this.project
    });

    this.projectPath = buildTask.project.root;

    commandOptions.environment = commandOptions.environment || 'production';
    commandOptions.outputPath = 'dist';

    return buildTask.run(commandOptions);
  },

  buildAndPublish(options, args, provideNewDomain) {
    args.push('--project', 'dist');

    return this.triggerBuild(options).then(() => {

      // copy index.html to 200.html to support real URLs,
      // see https://surge.sh/help/adding-a-200-page-for-client-side-routing
      this.copyIndex(this.projectPath);

      let domainName = this.cnameFile(this.projectPath);
      let domain = options.newDomain || domainName;

      if (domain && !provideNewDomain) {
        args.push('--domain', domain);
      }

      return this.runCommand('publish', args);
    });
  },

  run(options) {
    let args = [];

    if (options.whoami === '') {
      return this.runCommand('whoami', args);
    }

    if (options.list === '') {
      return this.runCommand('list', args);
    }

    if (options.login === '') {
      return this.runCommand('login', args);
    }

    if (options.logout === '') {
      return this.runCommand('logout', args);
    }

    if (options.token === '') {
      return this.runCommand('token', args);
    }

    if (options.teardown === '' || options.teardown) {
      args.push(options.teardown);
      return this.runCommand('teardown', args);
    }

    if (options.newDomain === '') {
      return this.buildAndPublish(options, args, true);
    }

    if (options.publish === '' || options.publish) {
      return this.buildAndPublish(options, args);
    }
  }
});
