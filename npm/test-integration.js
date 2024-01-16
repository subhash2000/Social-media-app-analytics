#!/usr/bin/env node
// ---------------------------------------------------------------------------------------------------------------------
// This script is intended to execute all integration tests.
// ---------------------------------------------------------------------------------------------------------------------
/* eslint-env node, es6 */

// set directories and files for test and coverage report
const path = require('path'),

  NYC = require('nyc'),
  chalk = require('chalk'),
  mkdir = require('shelljs').mkdir,
  recursive = require('recursive-readdir'),

  COV_REPORT_PATH = '.coverage',
  SPEC_SOURCE_DIR = path.join(__dirname, '..', 'test', 'integration');

module.exports = function (exit) {
  // banner line
  console.info(chalk.yellow.bold('Running integration tests using mocha on node...'));

  mkdir('-p', COV_REPORT_PATH);

  const Mocha = require('mocha'),
    nyc = new NYC({
      hookRequire: true,
      reportDir: COV_REPORT_PATH,
      tempDirectory: COV_REPORT_PATH,
      reporter: ['text', 'lcov', 'text-summary'],
      exclude: ['config', 'test', 'api/controllers/HealthController.js', 'api/responses/ok.js']
    });

  nyc.wrap();

  // add all spec files to mocha
  recursive(SPEC_SOURCE_DIR, function (err, files) {
    if (err) {
      console.error(err);

      return exit(1);
    }

    const mocha = new Mocha({ timeout: 1000 * 60 });

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

    // add bootstrap file
    mocha.addFile(path.join(SPEC_SOURCE_DIR, '_bootstrap.js'));

    files.filter(function (file) { // extract all test files
      return file.substr(-8) === '.test.js';
    }).forEach(mocha.addFile.bind(mocha));

    return mocha.run(async function (runError) {
      runError && console.error(runError.stack || runError);

      await nyc.reset();
      nyc.writeCoverageFile();
      await nyc.report();
      exit(runError ? 1 : 0);
    });
  });
};

// ensure we run this script exports if this is a direct stdin.tty run
!module.parent && module.exports(process.exit);
