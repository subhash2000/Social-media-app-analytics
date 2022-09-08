const _ = require('lodash'),
  getModel = require('../helpers/getModel');

module.exports = {
  /**
   * Create a record
   *
   * @param {Object} record - health record to be created
   * @param {Object} transaction - sequelize transaction
   *
   * @returns {Promise}
   */
  create: async function (record, transaction) {
    const Health = getModel('Health');

    if (_.isEmpty(record)) {
      return Promise.reject(new Error('HealthRepository~create: Mandatory Parameters missing'));
    }

    return Health.create(record, { transaction });
  },

  /**
   * Update a record
   *
   * @param  {Object} record - record to be updated
   * @param  {Object} record.where - clause for which update needs to happen
   * @param  {Object} record.data - data to be updated
   * @param  {Object} transaction - sequelize transaction
   *
   * @returns {Promise}
   */
  update: async function (record, transaction) {
    const Health = getModel('Health');

    if (!record || _.isEmpty(record.where) || _.isEmpty(record.data)) {
      return Promise.reject(new Error('HealthRepository~update: Mandatory Parameters missing'));
    }

    // https://github.com/sequelize/sequelize/issues/3759
    // set id again to make updateAt change work
    if (record.data && record.where && record.where.id) {
      record.data.id = record.where.id;
    }

    return Health.update(record.data, {
      where: record.where,
      transaction: transaction
    });
  },

  /**
   * Find all records from the health table
   *
   * @param  {Object} clause - all properties sequelize accepts in findAll handler
   * @returns {Promise}
   */
  findAll: async function (clause) {
    const Health = getModel('Health');

    return Health.findAll(clause);
  }
};
