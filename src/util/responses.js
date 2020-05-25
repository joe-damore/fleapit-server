/**
 * @file Functions to generate common and consistently-structured HTTP JSON
 * responses.
 */
module.exports = {

  /**
   * Returns an object containing an "error" property.
   *
   * The error property contains an error-specific code and a human readable
   * message.
   *
   * @param {Object} data - Arbitrary data to pass to error message function.
   * @param {Object} errorObject - Object describing error code and message.
   *
   * @return {Object} Object describing error to be sent in response.
   */
  error: (data, errorObject) => {
    const errorMessage = (() => {
      if (errorObject.message) {
        switch (typeof errorObject.message) {
          case `function`:
            return errorObject.message(data);
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
