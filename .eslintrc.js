'use strict';

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      legacyDecorators: true
    }
  },
  plugins: [
    'mocha'
  ],
  extends: 'sane',
  env: {
    es6: true,
    node: true
  },
  rules: {
    'mocha/no-exclusive-tests': 'error'
  }
};
