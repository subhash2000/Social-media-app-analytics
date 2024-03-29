#!/usr/bin/env node

const async = require('async'),
  chalk = require('chalk'),
  ESLintCLIEngine = require('eslint').CLIEngine,

  /**
   * The list of source code files / directories to be linted.
   *
   * @type {Array}
   */
  LINT_SOURCE_DIRS = [
    './api/controllers',
    './api/models',
    './api/services',
    './config',
    './npm'
  ];

module.exports = function (exit) {
  // banner line
  console.info(chalk.yellow.bold('\nLinting files using eslint...'));

  async.waterfall([

    /**
     * Instantiates an ESLint CLI engine and runs it in the scope defined within LINT_SOURCE_DIRS.
     *
     * @param {Function} next - The callback function whose invocation marks the end of the lint test run.
     * @returns {*}
     */
    function (next) {
      next(null, new ESLintCLIEngine().executeOnFiles(LINT_SOURCE_DIRS));
    },

    /**
     * Processes a test report from the Lint test runner, and displays meaningful results.
     *
     * @param {Object} report - The overall test report for the current lint test.
     * @param {Object} report.results - The set of test results for the current lint run.
     * @param {Function} next - The callback whose invocation marks the completion of the post run tasks.
     * @returns {*}
     */
    function (report, next) {
      const errorReport = ESLintCLIEngine.getErrorResults(report.results);

      // log the result to CLI
      console.info(ESLintCLIEngine.getFormatter()(report.results));
      // log the success of the parser if it has no errors
      (errorReport && !errorReport.length) && console.info(chalk.green('eslint ok!'));
      // ensure that the exit code is non zero in case there was an error
      next(Number(errorReport && errorReport.length) || 0);
    }
  ], exit);
};

// ensure we run this script exports if this is a direct stdin.tty run
!module.parent && module.exports(process.exit);
