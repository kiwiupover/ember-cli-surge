'use strict';

const defaults      = require('lodash/defaults');
const MockUI        = require('console-ui/mock');
const MockAnalytics = require('ember-cli/tests/helpers/mock-analytics');
const MockProject   = require('ember-cli/tests/helpers/mock-project');

function createProject() {
  let project = new MockProject();
  project.isEmberCLIProject = function() {
    return true;
  };
  project.config = function() {
    return {};
  };
  return project;
}

module.exports = function CommandOptionsFactory(options) {
  options = options || {};
  return defaults(options, {
    ui: new MockUI(),
    analytics: new MockAnalytics(),
    tasks: {},
    project: options.project || createProject(),
    commands: {},
    settings: {}
  });
};
