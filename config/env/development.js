/**
 * @fileOverview
 * The development environment defaults are stored in this file. Any additional configuration changes can be
 * done using environment variables used using `env-lift`.
 */

 module.exports = require('env-lift').load('bruke', {
  port: 1337,

  env: 'development',

  datastores: {
    database: 'bruke',
    port: 3306,
    pool: {
      // override other connection pool properties here if needed.
      max: 20,
      acquire: 60000
    },
    mysql: {
      host: 'localhost',
      user: 'root',
      password: ''
    },
    mysqlR: {
      host: 'localhost',
      user: 'root',
      password: ''
    }
  },


  // these will be directly overridden with
  // the base sequelize operations.
  sequelize: {
    dialectOptions: {
      multipleStatements: true
    },
    logging: false
  },

  // basic auth credentials.
  x: {
    username: 'user',
    password: 'pass'
  },

  supportSecret: 'support-secret',

  // fastify pino logger
  logs: {
    level: 'info'
  },

  routes: {}
});
