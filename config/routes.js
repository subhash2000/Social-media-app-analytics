const HealthController = require('../api/controllers/HealthController'),
  PostsController = require('../api/controllers/PostsController');

/**
   *
   * @param {String} name - unique scehma validation file name
   * @returns {Object} schema object
   */
const getSchema = function (name) {
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
    config: {
      rateLimit: false
    },
    handler: HealthController.status
  });

  fastify.get('/knockknock', {
    config: {
      rateLimit: false
    },
    handler: HealthController.check,
    schema: getSchema('healthCheck')
  });

  // routes for posts controller
  fastify.post('/api/v1/posts', {
    handler: PostsController.createPosts,
    schema: getSchema('createPosts')
  });

  fastify.get('/api/v1/posts/:uniqueIdentifier/analysis', {
    handler: PostsController.findByUniqueIdentifier
  });

  done();
};
