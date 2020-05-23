/**
 * @file Functions to generate consistently-structured HTTP JSON responses.
 */
module.exports = {

  /**
   * Returns an object containing an "error" property.
   *
   * The error property contains an error-specific code and a human readable
   * message.
   *
   * @param {Object} req - Express request object.
   * @param {Object} req - Object describing error code and message.
   *
   * @return {Object} Object describing error to be sent in response.
   */
  error: (req, errorObject) => {
    const errorMessage = (() => {
      if (errorObject.message) {
        switch (typeof errorObject.message) {
          case `function`:
            return errorObject.message(req);
          break;

          default:
            return errorObject.message;
          break;
        }
      }
      return "An error occurred";
    })();

    return {
      error: {
        code: errorObject.code,
        message: errorMessage,
      },
    };
  },

  /**
   * Returns an object containing a generic string message.
   *
   * If no message is specified, 'OK' is used.
   *
   * @param {string|undefined} message - Optional message to display.
   *
   * @returns {Object} Object containing message to be sent in response.
   */
  message: (message) => {
    const messageString = message ?? 'OK';
    return { message: messageString };
  },

  /**
   * Returns an object containing a generic string message 'OK'.
   *
   * @returns {Object} Object containing message describing OK status.
   */
  ok: () => {
    return { message: 'OK' };
  },

};
