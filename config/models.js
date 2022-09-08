const _ = require('lodash'),
  { DataTypes } = require('sequelize'),

  models = require('../api/models/index');

/**
 * @param {Object} sequelize - sequelize connection instance.
 * @param {String} types - datatypes
 */
module.exports = function (sequelize) {
  if (!models) {
    throw new Error('No models found to define');
  }

  _.forEach(models, function (model) {
    model(sequelize, DataTypes);
  });
};
