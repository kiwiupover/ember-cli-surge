'use strict';

var assert        = require('chai').assert;
var MockUI        = require('ember-cli/tests/helpers/mock-ui');
var MockAnalytics = require('ember-cli/tests/helpers/mock-analytics');
var Command       = require('ember-cli/lib/models/command');
var Task          = require('ember-cli/lib/models/task');
var RSVP          = require('rsvp');

var DivshotCommandBase = require('../../../lib/commands/surge');

describe('surge command', function() {
  var ui;
  var tasks;
  var analytics;
  var project;
  var fakeSpawn;
  var CommandUnderTest;
  var buildTaskCalled;
  var buildTaskReceivedProject;

  before(function() {
    CommandUnderTest = Command.extend(DivshotCommandBase);
  });

  beforeEach(function() {
    buildTaskCalled = false;
    ui = new MockUI();
    analytics = new MockAnalytics();
    tasks = {
      Build: Task.extend({
        run: function() {
          buildTaskCalled = true;
          buildTaskReceivedProject = !!this.project;

          return RSVP.resolve();
        }
      })
    };

    project = {
      isEmberCLIProject: function(){
        return true;
      }
    };
  });

  it('shells out to `surge` command line utility', function() {
    return new CommandUnderTest({
      ui: ui,
      analytics: analytics,
      project: project,
      environment: { },
      tasks: tasks,
      settings: {},
      runCommand: function(command, args) {
        assert.include(command, 'surge/lib/cli.js');
        assert.deepEqual(args, ["--project", "dist", "--domain", "ember-cli-surge.surge.sh"]);
      }
    }).validateAndRun(['-d my-site.com']);
  });

  it('accecpts `surge` option arguments', function() {
    return new CommandUnderTest({
      ui: ui,
      analytics: analytics,
      project: project,
      environment: { },
      tasks: tasks,
      settings: {},
      runCommand: function(command, args) {
        assert.include(command, 'surge/lib/cli.js');
      }
    }).validateAndRun();
  });

  it('runs build before running the command', function() {
    return new CommandUnderTest({
      ui: ui,
      analytics: analytics,
      project: project,
      environment: { },
      tasks: tasks,
      settings: {},
      runCommand: function(command, args) {
        assert(buildTaskCalled,
            'expected build task to be called');
        assert(buildTaskReceivedProject,
            'expected build task to receive project');
      }
    }).validateAndRun();
  });
});
