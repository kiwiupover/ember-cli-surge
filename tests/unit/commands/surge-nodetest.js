'use strict';

var expect         = require('chai').expect;
var stub           = require('ember-cli/tests/helpers/stub');
var MockProject    = require('ember-cli/tests/helpers/mock-project');
var Promise        = require('ember-cli/lib/ext/promise');
var Task           = require('ember-cli/lib/models/task');
var BuildCommand   = require('ember-cli/lib/commands/build');
var Surge          = require('surge');

var commandOptions = require('../../factories/command-options');

var SurgeCommand   = require('../../../lib/commands/surge');

var surge = new Surge;

var safeRestore = stub.safeRestore;
stub = stub.stub;

describe('Surge commands', function() {
  var tasks, options, command, project;
  var buildRun;
  var cNameCalled;
  var buildTaskCalled;
  var copyTaskCalled;
  var surgeCommand;
  var expectedArgs;

  beforeEach(function() {
    tasks = {
      Build: Task.extend({
        run: function() {
          buildTaskCalled = true;
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
        cNameCalled = true;
        return 'surge-app.surge.sh';
      },

      copyIndex: function() {
        copyTaskCalled = true;
        return true;
      },

      tasks: tasks
    });

    command = new SurgeCommand(options);

    stub(command, 'runCommand', Promise.resolve());
    stub(command, 'triggerBuild', Promise.resolve());
  });

  afterEach(function() {
    safeRestore(command, 'runCommand');
    safeRestore(command, 'triggerBuild');
  });

  it('#triggerBuild', function(done){
    command.triggerBuild(options);
    tasks.Build.prototype.run();

    expect(buildTaskCalled).to.equal(true, 'expected build to be calledWith');
    done();
  });

  it('#buildAndPublish', function(done){
    var args = [];

    tasks.Build.prototype.run();

    command.buildAndPublish(options, args).then(function(){
      expect(cNameCalled).to.equal(true, 'read cName file');
      expect(copyTaskCalled).to.equal(true, 'copied index file');
      expect(buildTaskCalled).to.equal(true, 'expected build to be calledWith');
      expect(args).to.deep.equal([ '--project', 'dist', '--domain', 'surge-app.surge.sh' ]);
      done();
    });

  });

  it('Builds and deploys with `ember surge --publish`', function(done){
    tasks.Build.prototype.run;
    var args = [];

    command.validateAndRun(['ember', 'surge', '--publish']).then(function(){
      surgeCommand = command.runCommand.calledWith[0][0];
      expectedArgs = command.runCommand.calledWith[0][1];

      expect(surgeCommand).to.equal('publish');
      expect(expectedArgs).to.deep.equal(['--project', 'dist', '--domain', 'surge-app.surge.sh']);
      done();
    });
  });

  it('Builds and deploys with `ember surge`', function(done){
    tasks.Build.prototype.run;

    command.validateAndRun(['ember', 'surge']).then(function(){
      surgeCommand = command.runCommand.calledWith[0][0];
      expectedArgs = command.runCommand.calledWith[0][1];

      expect(surgeCommand).to.equal('publish');
      expect(expectedArgs).to.deep.equal(['--project', 'dist', '--domain', 'surge-app.surge.sh']);
      done();
    });
  });

  it('Build and deploy development', function(done){
    var triggerBuildArgs;
    var args = [];

    tasks.Build.prototype.run;

    command.validateAndRun(['ember', 'surge', '--environment', 'development']).then(function(){
      triggerBuildArgs = command.triggerBuild.calledWith[0][0];
      surgeCommand = command.runCommand.calledWith[0][0];
      expectedArgs = command.runCommand.calledWith[0][1];

      expect(triggerBuildArgs.environment).to.equal('development');
      expect(surgeCommand).to.equal('publish');
      expect(expectedArgs).to.deep.equal(['--project', 'dist', '--domain', 'surge-app.surge.sh']);
      done();
    });
  });

  it('Build and deploy with out passing a domain', function(done){
    var args = [];

    tasks.Build.prototype.run;

    command.validateAndRun(['ember', 'surge', '--new-domain']).then(function(){
      surgeCommand = command.runCommand.calledWith[0][0];
      expectedArgs = command.runCommand.calledWith[0][1];

      expect(surgeCommand).to.equal('publish');
      expect(expectedArgs).to.deep.equal(['--project', 'dist']);
      done();
    });
  });

  var surgeCommands = ['login', 'logout', 'whoami', 'list', 'token'];

  surgeCommands.forEach(function(surgeCommand){
    it('Can execute ' + surgeCommand + ' surge command', function(done) {
      command.validateAndRun(['ember', 'surge', '--' + surgeCommand]).then(function(){
        expectedArgs = command.runCommand.calledWith[0][0];
        expect(expectedArgs).to.equal(surgeCommand);
        done();
      });
    });
  });

});
