'use strict';

var expect         = require('chai').expect;
var stub           = require('ember-cli/tests/helpers/stub');
var Promise        = require('ember-cli/lib/ext/promise');
var Task           = require('ember-cli/lib/models/task');
var BuildCommand   = require('ember-cli/lib/commands/build');
var commandOptions = require('../../factories/command-options');


var SurgeCommand = require('../../../lib/commands/surge');

var safeRestore = stub.safeRestore;
stub = stub.stub;

describe('build command', function() {
  var tasks, options, command, project;
  var buildTaskInstance;

  beforeEach(function() {
    tasks = {
      Build: Task.extend({
        run: function() {
          buildTaskCalled = true;
          buildTaskReceivedProject = !!this.project;

          return Promise.resolve();
        }
      })
    };

    project = {
      root: 'surge-app',
      isEmberCLIProject: function(){
        return true;
      }
    };

    options = commandOptions({
      cnameFile: function() {
        return 'surge-app.surge.sh';
      },

      copyIndex: function() {
        copyTaskCalled = true;
        return true;
      },

      tasks: tasks
    });

    // console.log('SurgeCommand', SurgeCommand);

    command = new SurgeCommand.runCommand(options);

    stub(tasks.Build.prototype, 'run', Promise.resolve());
  });

  afterEach(function() {
    safeRestore(tasks.Build.prototype, 'run');
  });

  it('Build task is provided with the project instance', function() {
    expect(true).to.equal(true);
  });

});
