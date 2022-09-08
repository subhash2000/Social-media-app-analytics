/**
 * All the supported errorNames is API
 */
 const CustomError = require('./CustomError'),

 // https://www.fastify.io/docs/latest/Errors/#fastify-error-codes
 // CTP -> Content Type
 FASTIFY_EXPECTED_ERRORS = [
   'FST_ERR_BAD_URL',
   'FST_ERR_CTP_EMPTY_JSON_BODY',
   'FST_ERR_CTP_BODY_TOO_LARGE',
   'FST_ERR_CTP_EMPTY_TYPE',
   'FST_ERR_CTP_INVALID_CONTENT_LENGTH',
   'FST_ERR_CTP_INVALID_MEDIA_TYPE',
   'FST_ERR_CTP_INVALID_TYPE'
 ],

 /**
 * @param {Number} status - status of the error
 * @param {String} name - error name
 * @param {String} message - optional
 * @param {String} detail - optional
 * @param {String} instance - optional
 * @param {...any} args any Error class argument
 * @returns {Object} error obj that can be used in ErrorService to send error
 */
 createError = function (status, name, message, detail, instance, ...args) {
   return new CustomError(status, name, message, detail, instance, ...args);
 };

module.exports = {
 getFrameWorkExpectedErrors: function () {
   return FASTIFY_EXPECTED_ERRORS;
 },

 serverError: (options = {}) => {
   const {
     name = 'serverError',
     message = 'Internal Server Error.',
     detail,
     instance
   } = options;

   return new createError(500, {
     name,
     message,
     detail,
     instance
   });
 },

 badRequest: function (options = {}) {
   const {
     name = 'badRequest',
     message = 'Invalid Request.',
     detail,
     instance
   } = options;

   return new createError(400,
     name,
     message,
     detail,
     instance);
 },

 forbidden: function ({ detail, instance }) {
   return new createError(403,
     'forbidden',
     'Access to this resource is forbidden for this user',
     detail,
     instance);
 },

 authenticationError: function ({ message, detail, instance }) {
   return createError(403,
     'authenticationError',
     message,
     detail,
     instance);
 },

 internalServerError: function ({ message, detail, instance }) {
   return createError(500,
     'internalServerError',
     message,
     detail,
     instance);
 },

 invalidParamsError: function ({ detail, instance }) {
   return createError(400,
     'badRequest',
     'The specified parameter is in an invalid format',
     detail,
     instance);
 },

 notFound: function ({ message, detail, instance }) {
   return createError(404,
     'badRequest',
     message || 'The requested resource not found',
     detail,
     instance);
 },

 invalidParamError: function ({ message, detail, instance }) {
   return createError(400,
     'invalidParamError',
     message,
     detail,
     instance);
 },

 upstreamServiceError: function ({ message, detail, instance, internal }) {
   return createError(500,
     'upstreamServiceError',
     message,
     detail,
     instance,
     internal);
 }
};
