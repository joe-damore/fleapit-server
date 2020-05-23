/**
 * @file Enum-like structure of application-wide error codes.
 */

module.exports = {
  /**
   * Code for generic server error.
   *
   * Most typically used for 500 responses, this error code should be used
   * when a server-side error occurs whose cause cannot otherwise be
   * determined at the time of the error.
   */
  SERVER_ERROR: {
    code: `SERVER_ERROR`,
    message: () => `An internal server error occurred`,
  },
};
