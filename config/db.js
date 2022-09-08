const _ = require('lodash'),
  Sequelize = require('sequelize');

module.exports = function () {
  /**
   * Sequelize supports Read replication criteria
   * and can be essentially used.
   *
   * https://sequelize.org/master/manual/read-replication.html
   */
  const envConfig = global.app.config,

    replicationConfig = {};

  // pick the writer config
  if (_.get(envConfig, 'datastores.mysql')) {
    replicationConfig.write = {
      host: envConfig.datastores.mysql.host,
      username: envConfig.datastores.mysql.user || 'root',
      password: envConfig.datastores.mysql.password
    };
  }

  // pick the reader config
  if (_.get(envConfig, 'datastores.mysqlR')) {
    replicationConfig.read = [];

    replicationConfig.read.push({
      host: envConfig.datastores.mysqlR.host,
      username: envConfig.datastores.mysqlR.user,
      password: envConfig.datastores.mysqlR.password
    });
  }

  let connectionPoolConfig = _.get(envConfig, 'datastores.pool', {});

  return new Sequelize(_.get(envConfig, 'datastores.database'), null, null, _.assign({}, {
    dialect: 'mysql',
    dialectOptions: {
      multipleStatements: true
    },
    logging: false,
    port: _.get(envConfig, 'datastores.port'),
    replication: replicationConfig
  }, !_.isEmpty(connectionPoolConfig) && { pool: connectionPoolConfig }, envConfig.sequelize));
};
