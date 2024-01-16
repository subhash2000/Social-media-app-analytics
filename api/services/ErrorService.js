/**
 * Send error only from policy or Controller layer
 */
const _ = require('lodash'),
  CustomError = require('../helpers/CustomError'),
  Errors = require('../helpers/Errors'),
  UNKNOWN_ERROR = 'unknown',

  Ajv = require('ajv'),
  AjvErrors = require('ajv-errors'),

  /*
* response.body = {
*     "error": {
*        "status": 400,
*         "name": "paramMissingError",
*         "message": "body.name is missing",
*         "detail": "Workspace name is required ",
*         "instance": "workspace/45d85bbd-5ac7-4465-b4ee-f8186d5d0b52"
*     }
* }
*
*/

  /**
* Will send the supported errors in response
* All uspported errors re alisted in errors helper
*
* @param {Object} res Fastify response object
* @param {Object} err CustomError object
* @param {Number} err.status Http status - 400
* @param {String} err.name error codeName - invalidParamError
* @param {String} err.message error message - Incorrect workspace name
* @param {String} err.detail error message - Workspace name should be unique in the public space of team/user
* @param {String} err.instance error message - workspace/b7877ba7-ea35-4d3b-9c07-8981b2a5acaa
*/
  sendError = function (res, err) {
    // define body explicity so error response format is always consistant
    let body = {
      error: {
        status: err && err.status || 500,
        name: err && err.name || UNKNOWN_ERROR
      }
    };

    // only custom error are exposed to clients
    if (err instanceof CustomError) {
      body.error.message = err.message || '';
      body.error.detail = err.detail || '';
      body.error.instance = err.instance || '';
    }
    else {
      // eslint-disable-next-line no-unused-vars
      const unexpectedError = {
        message: err.message || '',
        stack: err.stack || ''
      };
    }

    res.status(body.error.status).send(body);
  };

module.exports = {

  sendError: sendError,

  fastifyCustomErrorHandler: function (err, req, reply) {
    // capture error to sentry first before any processing
    if (global.app.sentry) {
      // skip validation and custom errors from sentry
      let isExpectedError = false,
        frameWorkExpectedErrors = Errors.getFrameWorkExpectedErrors();

      if (err && err.validationContext) {
        // validation errors
        isExpectedError = true;
      }

      if (err instanceof CustomError) {
        // all defined errors
        isExpectedError = true;
      }

      if (err && err.statusCode === 400) {
        // serialization errors
        isExpectedError = true;
      }

      if (err && err.code && _.includes(frameWorkExpectedErrors, err.code)) {
        // fastify framework errors
        isExpectedError = true;
      }

      if (!isExpectedError) {
        // eslint-disable-next-line no-undef
        Sentry.captureException(reply, err);
      }
    }

    let customError;

    if (err instanceof CustomError) {
      // all defined errors
      return sendError(reply, err);
    } else if (err.validationContext) {
      // handle validation error
      customError = Errors.invalidParamError({
        message: err.message
      });
    } else if (err.code) {
      customError = new CustomError(err.statusCode,
        err.name,
        err.code,
        err.message);
    } else if (err.statusCode === 400) {
      // serialization errors
      customError = Errors.invalidParamsError({
        detail: err.message
      });
    } else {
      customError = Errors.internalServerError({
        message: err.message
      });
    }

    return sendError(reply, customError);
  },

  fastifyNotFoundHandler: function (req, reply) {
    try {
      let customError = Errors.notFound({
        detail: req.url
      });

      return sendError(reply, customError);
    } catch (err) {
      return sendError(reply, err);
    }
  },

  compileCustomValidationErrors: function ({ schema }) {
    const ajv = new Ajv({ allErrors: true, jsonPointers: false, coerceTypes: true });

    // enhance the ajv instance
    AjvErrors(ajv, {
      singleError: true
    });

    const validate = ajv.compile(schema);

    return validate;
  }
};
