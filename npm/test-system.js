#!/usr/bin/env node

const async = require('async'),
  chalk = require('chalk'),
  Mocha = require('mocha'),
  packity = require('packity'),
  mkdir = require('shelljs').mkdir,
  recursive = require('recursive-readdir'),
  COV_REPORT_PATH = '.coverage',

  /**
   * The source directory for system test specs.
   *
   * @type {String}
   */
  SPEC_SOURCE_DIR = './test/system';

module.exports = function (exit) {
  // banner line
  console.info(chalk.yellow.bold('\nRunning system tests...\n'));

  mkdir('-p', COV_REPORT_PATH);

  async.series([

    /**
     * Enforces sanity checks on installed packages via packity.
     *
     * @param {Function} next - The callback function invoked when the packge sanity check has concluded.
     * @returns {*}
     */
    function (next) {
      console.info('checking installed packages...\n');
      packity({ path: '.' }, packity.cliReporter({}, next));
    },

    /**
     * Runs system tests on SPEC_SOURCE_DIR using Mocha.
     *
     * @param {Function} next - The callback invoked to mark the completion of the test run.
     * @returns {*}
     */
    function (next) {
      console.info('\nrunning system specs using mocha...');

      let mocha = new Mocha();

      recursive(SPEC_SOURCE_DIR, function (err, files) {
        if (err) { return next(err); }
        // Check for BITBUCKET_COMMIT and CI environment variable which is set by bitbucket
        // when running in pipeline
        if (process.env.CI && process.env.BITBUCKET_COMMIT) { // eslint-disable-line no-process-env
          // create test-reports directory inside .tmp which is required by bitbucket
          mkdir('-p', '.tmp/test-reports');

          // Change mocha reporter to xunit for bitbucket parseable report
          mocha.reporter('xunit', {
            output: `.tmp/test-reports/integration-report-${Date.now()}-${process.pid}.xml`
          });
        }

        files.filter(function (file) { // extract all test files
          return file.substr(-8) === '.test.js';
        }).forEach(mocha.addFile.bind(mocha));

        // start the mocha run
        return mocha.run(function (runError) {
          runError && console.error(runError.stack || runError);

          next(runError ? 1 : 0);
        });
      });
    }
  ], exit);
};

// ensure we run this script exports if this is a direct stdin.tty run
!module.parent && module.exports(process.exit);
