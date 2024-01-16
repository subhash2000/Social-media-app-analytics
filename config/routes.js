const HealthController = require('../api/controllers/HealthController');

  /**
   *
   * @param {String} name - unique scehma validation file name
   * @returns {Object} schema object
   */
  getSchema = function (name) {
    let schema = {};

    try {
      // eslint-disable-next-line security/detect-non-literal-require
      schema = require(`./schemas/${name}`);
    }
    catch (e) {
      // Todo - Add error handling
    }

    return schema;
  };

module.exports = function (fastify, opts, done) {
  // routes for health controller
  fastify.get('/', {
    handler: HealthController.status
  });

  fastify.get('/knockknock', {
    handler: HealthController.check,
    schema: getSchema('healthCheck')
  });

  done();
};
