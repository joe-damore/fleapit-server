/**
 * @file Functions to generate consistently-structured HTTP JSON responses.
 */
module.exports = {

  /**
   * Returns an object containing an "error" property.
   *
   * The error property contains an error-specific code and a human readable
   * message.
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
   */
  message: (message) => {
    const messageString = message ?? 'OK';
    return { message: messageString };
  },

  /**
   * Returns an object containing a generic string message 'OK'.
   */
  ok: () => {
    return { message: 'OK' };
  },

};
