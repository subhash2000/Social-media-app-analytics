#!/usr/bin/env node

const async = require('async'),
  chalk = require('chalk'),

  startedAt = Date.now(),

  name = require('../package.json').name;

module.exports = function (exit) {
  try {
    async.series([
      require('./test-lint')
      // require('./test-system'),
    //   require('./test-integration'),
    //   require('./test-unit')
    ], function (code) {
      // eslint-disable-next-line max-len
      console.info(chalk[code ? 'red' : 'green'](`\n${name}: duration ${Date.now() - startedAt}\n${name}: ${code ? 'not ok' : 'ok'}!`));
      exit(code && (typeof code === 'number' ? code : 1) || 0);
    });
  }
  catch (e) {
    console.error(e);
  }
};

!module.parent && module.exports(process.exit);
