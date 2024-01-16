/* eslint-disable no-process-env */
/**
 * @fileOverview
 * The development environment defaults are stored in this file. Any additional configuration changes can be
 * done using environment variables used using `env-lift`.
 */
require('dotenv').config();


module.exports = require('env-lift').load('Social-media-app-analytics', {
  port: process.env.PORT || 3000,
  env: process.env.ENV || 'development',
  datastores: {
    database: process.env.DB_NAME || 'social_media_analytics',
    port: process.env.DB_PORT || 3306,
    pool: {
      max: 20,
      acquire: 60000
    },
    mysql: {
      host: process.env.MYSQL_HOST || 'localhost',
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || ''
    },
    mysqlR: {
      host: process.env.MYSQLR_HOST || 'localhost',
      user: process.env.MYSQLR_USER || 'root',
      password: process.env.MYSQLR_PASSWORD || ''
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
