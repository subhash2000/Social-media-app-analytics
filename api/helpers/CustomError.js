const _ = require('lodash');

class CustomError extends Error {
  constructor (status, name, message, detail, instance, internal, ...args) {
    super(...args);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError);
    }

    if ((typeof name !== 'string' && typeof name !== 'undefined') ||
      (typeof status !== 'number' && typeof status !== 'undefined') ||
      (typeof message !== 'string' && typeof message !== 'undefined') ||
      (typeof detail !== 'string' && typeof detail !== 'undefined') ||
      (typeof instance !== 'string' && typeof instance !== 'undefined')) {
      return;
    }

    if (!_.isEmpty(internal)) {
      this.internal = internal;
    }

    this.name = name;
    this.status = status;
    this.message = message;
    this.detail = detail;
    this.instance = instance;
  }
}

module.exports = CustomError;
