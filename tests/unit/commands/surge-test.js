'use strict';

const Promise        = require('rsvp');
const expect         = require('chai').expect;
const Promise        = require('rsvp');
const Task           = require('ember-cli/lib/models/task');
const helperStub     = require('../../helpers/stub');
const commandOptions = require('../../factories/command-options');
const SurgeCommand   = require('../../../lib/commands/surge');

const safeRestore    = helperStub.safeRestore;
const stub           = helperStub.stub;

describe('Surge commands', function() {
  let tasks;
  let options;
  let command;
  let cNameCalled;
  let surgeCommand;
  let expectedArgs;
  let copyTaskCalled;
  let buildTaskCalled;

  beforeEach(function() {
    tasks = {
      Build: Task.extend({
        run() {
          buildTaskCalled = true;
          return Promise.resolve();
        }
      })
    };

    options = commandOptions({
      cnameFile() {
        cNameCalled = true;
        return 'surge-app.surge.sh';
      },

      copyIndex() {
        copyTaskCalled = true;
        return true;
      },

      tasks
    });

    command = new SurgeCommand(options);

    stub(command, 'runCommand', Promise.resolve());
    stub(command, 'triggerBuild', Promise.resolve());
  });

  afterEach(function() {
    safeRestore(command, 'runCommand');
    safeRestore(command, 'triggerBuild');
  });

  it('#triggerBuild', function(done) {
    command.triggerBuild(options);
    tasks.Build.prototype.run();

    expect(buildTaskCalled).to.equal(true, 'expected build to be calledWith');
    done();
  });

  it('#buildAndPublish', function(done) {
    let args = [];

    tasks.Build.prototype.run();

    command.buildAndPublish(options, args).then(function() {
      expect(cNameCalled).to.equal(true, 'read cName file');
      expect(copyTaskCalled).to.equal(true, 'copied index file');
      expect(buildTaskCalled).to.equal(true, 'expected build to be calledWith');
      expect(args).to.deep.equal(['--project', 'dist', '--domain', 'surge-app.surge.sh']);
      done();
    });
  });

  it('Builds and deploys with `ember surge --publish`', function(done) {
    tasks.Build.prototype.run;

    command.validateAndRun(['ember', 'surge', '--publish']).then(function() {
      surgeCommand = command.runCommand.calledWith[0][0];
      expectedArgs = command.runCommand.calledWith[0][1];

      expect(surgeCommand).to.equal('publish');
      expect(expectedArgs).to.deep.equal(['--project', 'dist', '--domain', 'surge-app.surge.sh']);
      done();
    });
  });

  it('Teardown a published project with `ember surge --teardown`', function(done) {
    tasks.Build.prototype.run;

    command.validateAndRun(['ember', 'surge', '--teardown']).then(function() {
      surgeCommand = command.runCommand.calledWith[0][0];

      expect(surgeCommand).to.equal('teardown');
      done();
    });
  });

  it('Builds and deploys with `ember surge`', function(done) {
    tasks.Build.prototype.run;

    command.validateAndRun(['ember', 'surge']).then(function() {
      surgeCommand = command.runCommand.calledWith[0][0];
      expectedArgs = command.runCommand.calledWith[0][1];

      expect(surgeCommand).to.equal('publish');
      expect(expectedArgs).to.deep.equal(['--project', 'dist', '--domain', 'surge-app.surge.sh']);
      done();
    });
  });

  it('Build and deploy development', function(done) {
    let triggerBuildArgs;

    tasks.Build.prototype.run;

    command.validateAndRun(['ember', 'surge', '--environment', 'development']).then(function() {
      triggerBuildArgs = command.triggerBuild.calledWith[0][0];
      surgeCommand = command.runCommand.calledWith[0][0];
      expectedArgs = command.runCommand.calledWith[0][1];

      expect(triggerBuildArgs.environment).to.equal('development');
      expect(surgeCommand).to.equal('publish');
      expect(expectedArgs).to.deep.equal(['--project', 'dist', '--domain', 'surge-app.surge.sh']);
      done();
    });
  });

  it('Build and deploy with out passing a domain', function(done) {

    tasks.Build.prototype.run;

    command.validateAndRun(['ember', 'surge', '--new-domain']).then(function() {
      surgeCommand = command.runCommand.calledWith[0][0];
      expectedArgs = command.runCommand.calledWith[0][1];

      expect(surgeCommand).to.equal('publish');
      expect(expectedArgs).to.deep.equal(['--project', 'dist']);
      done();
    });
  });

  it('Build and deploy to the user provided domain', function(done) {

    tasks.Build.prototype.run;

    command.validateAndRun(['ember', 'surge', '--new-domain=daves-domain.surge.sh']).then(function() {
      surgeCommand = command.runCommand.calledWith[0][0];
      expectedArgs = command.runCommand.calledWith[0][1];

      expect(surgeCommand).to.equal('publish');
      expect(expectedArgs).to.deep.equal(['--project', 'dist', '--domain', 'daves-domain.surge.sh']);
      done();
    });
  });

  let surgeCommands = ['login', 'logout', 'whoami', 'list', 'token', 'teardown'];

  surgeCommands.forEach(function(surgeCommand) {
    it('Can execute ' + surgeCommand + ' surge command', function(done) {
      command.validateAndRun(['ember', 'surge', '--' + surgeCommand]).then(function() {
        expectedArgs = command.runCommand.calledWith[0][0];
        expect(expectedArgs).to.equal(surgeCommand);
        done();
      });
    });
  });
});
