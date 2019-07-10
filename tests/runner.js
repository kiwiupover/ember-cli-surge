'use strict';

let glob = require('glob');
let Mocha = require('mocha');

let mocha = new Mocha({
  reporter: 'spec'
});

let arg = process.argv[2];
let root = 'tests/';

function addFiles(mocha, files) {
  glob.sync(root + files).forEach(mocha.addFile.bind(mocha));
}

addFiles(mocha, '/**/*-test.js');

if (arg === 'all') {
  addFiles(mocha, '/**/*-nodetest-slow.js');
}

mocha.run(function(failures) {
  process.on('exit', function() {
    process.exit(failures);
  });
});
