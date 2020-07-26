const errorCodes = require('./errorCodes.js');
const responses = require('./responses.js');

const { ValidationError, UniqueConstraintError } = require('sequelize');

/*
 * Array of objects to test for and respond to different application-wide
 * errors.
 */
const errorHandlers = [

  // Sequelize validation error.
  {
    test: (err) => (err.constructor === ValidationError),
    response: (err, req) => [400, responses.error(err.errors[0], errorCodes.VALIDATION_ERROR)],
  },

  // Sequelize 'Not-Null' violation error.
  {
    test: (err) => (err.constructor === ValidationError && err.errors[0].type === 'notNull Violation'),
    response: (err, req) => [400, responses.error(err.errors[0], errorCodes.NOT_NULL_VIOLATION)],
    specifity: 1,
  },

  // Sequelize unique constraint error.
  {
    test: (err) => (err.constructor === UniqueConstraintError),
    response: (err, req) => [400, responses.error(err.fields, errorCodes.UNIQUE_CONSTRAINT_ERROR)],
  },
];

/**
 * Handles the given error by testing it against each error handler.
 *
 * If no error handler array is specified, the default `errorHandlers` handlers
 * are used instead.
 */
const handleError = (err, req, res, handlers) => {
  // Use default `errorHandlers` if `handlers` is not specified.
  const inputHandlers = (() => {
    if (handlers) {
      return handlers;
    }
    return errorHandlers;
  })();

  const transformedHandlers = inputHandlers
    // Add specifity property if one does not exist.
    .map((handler) => {
      const out = handler;
      if (out.specifity === undefined || out.specifity === null) {
        out.specifity = 0;
      }
      return out;
    })
    // Sort by descending specifity.
    .sort((a, b) => {
      if (b.specifity > a.specifity) {
        return 1;
      }
      return -1;
    });

  // Test error against each error handler.
  let i;
  for (i = 0; i < transformedHandlers.length; i += 1) {
    const handler = transformedHandlers[i];
    if (handler.test(err)) {
      return handler.response(err, req, res);
    }
  }
  return null;
};

/**
 * Returns an error digest object for the given error, request, and response.
 *
 *
 */
const errorDigest = (err, req, res, handlers) => {

  const response = handleError(err, req, res, handlers);

  /**
   *
   */
  const digest = {
    err: err,
    req: req,
    res: res,
    response: response,

    /**
     * Uses the given callback to test for non-digested errors.
     *
     * @param {function} callback - Function to execute when error is not digested.
     *
     * @returns {Object} This instance.
     */
    remaining: function(callback) {
      if (!this.response) {
        this.response = callback(this.err, this.req, this.res);
      }
      return this;
    },

    /**
     * Use the given error handlers to test for non-digested errors.
     *
     * @param {Array} handlers - Array of error handlers to test non-digested error against.
     *
     * @returns {Object} This instance.
     */
    remainingWithHandlers: function(handlers) {
      this.response = handleError(err, req, res, handlers);
      return this;
    },

    /**
     * Sends the response for this error digest object.
     *
     * @returns {Object} This instance.
     */
    send: function() {
      if (this.response === null) {
        console.log(this.err);
        this.response = [500, responses.error(req, errorCodes.SERVER_ERROR)];
      }

      this.res
        .status(this.response[0])
        .send(this.response[1]);

      return this;
    },
  };

  return digest;
};

module.exports = errorDigest;
