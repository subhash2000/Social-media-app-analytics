
/**
 * To start the server here.
 */
const environmentConfig = require('./config/config')();

// Globally expose environment configuration
global.app = {
  config: environmentConfig
};

let _ = require('lodash'),
  fastify = require('fastify')({
    trustProxy: true,
    bodyLimit: 1048576 * 100, // Setting this because we take summary & description in the body sometimes
    disableRequestLogging: true,
    ajv: {
      customOptions: {
        removeAdditional: false
      }
    }
  }),

  packageJson = require('./package'),

  initializeDb = require('./config/db'),
  initializeModels = require('./config/models'),

  ErrorService = require('./api/services/ErrorService');

// Globally expose the fastify variable
global.app.fastify = fastify;

module.exports = async () => {
  try {
    /**
     * Attach the fastify-express middleware
     */
    await fastify.register(require('fastify-express'));

    /**
     * Attach the security and cors module
     */
    fastify.use(require('cors')(environmentConfig.security.cors));
    fastify.register(require('fastify-helmet'), environmentConfig.security.helmet);

    /**
     * Attach the routes
     */
    fastify.register(require('./config/routes'));

    // add custom error handler for fastify generated errors
    fastify.setErrorHandler(ErrorService.fastifyCustomErrorHandler);

    // handle all route not found 404
    fastify.setNotFoundHandler(ErrorService.fastifyNotFoundHandler);

    /**
    * Initialize the ORM with db connection,
    *
    * and make sure db connection is successful
    */
    global.app.sequelize = initializeDb();

    // make sure the connection works and is successful
    await global.app.sequelize.authenticate();

    initializeModels(global.app.sequelize);

    /* To allow connections from outside docker */
    let address = await global.app.fastify.listen(global.app.config.port, '0.0.0.0');

    console.log(`Server lifted at address ${address}`);
  }

  catch (e) {
    console.log('Moderation Service ~ Error during lifting the server', e);

    process.exit(1);
  }
};

// ensure we run this script exports if this is a direct stdin.tty run
!module.parent && module.exports();
