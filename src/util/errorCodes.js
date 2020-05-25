/**
 * @file Enum-like structure of application-wide error codes.
 */

/**
 * Enum-like structure of error codes that could occur application-wide.
 */
const errorCodes = {
  /**
   * Code for generic server error.
   *
   * Most typically used for 500 responses, this error code should be used
   * when a server-side error occurs whose cause cannot otherwise be
   * determined at the time of the error.
   */
  SERVER_ERROR: {
    code: `SERVER_ERROR`,
    message: `An internal server error occurred`,
  },

  /**
   * Sequelize generic validation error.
   *
   * Occurs when a Sequelize operation fails to validate, but the specific cause
   * of the validation error has not been or cannot be determined.
   */
  VALIDATION_ERROR: {
    code: `VALIDATION_ERROR`,

    /**
     * Generates an error message from the given ValidationErrorItem instance.
     *
     * @param {Object} - Instance of ValidationErrorItem.
     * @returns {string} Message describing ValidationErrorItem error.
     */
    message: (errorItem) => `Validation error: ${errorItem.message}`,
  },

  /**
   * Sequelize not-null validation error.
   *
   * Occurs when a Sequelize operation attempts to set a column value to null
   * when the column disallows null values.
   */
  NOT_NULL_VIOLATION: {
    code: `NOT_NULL_VIOLATION`,

    /**
     * Generates an error message from the given ValidationErrorItem instance.
     *
     * @param {Object} - Instance of ValidationErrorItem.
     * @returns {string} Message describing ValidationErrorItem error.
     */
    message: (errorItem) => `Validation error: ${errorItem.message}`,
  },

  /**
   * Sequelize unique constraint violation error.
   *
   * Occurs when a Sequelize operation attempts to set a column to a
   * non-unique value.
   */
  UNIQUE_CONSTRAINT_ERROR: {
    code: `UNIQUE_CONSTRAINT_ERROR`,

    /**
     * Generates an error message for the given non-unique fields.
     *
     * @param {Array} - Array of strings containing non-unique field names.
     * @returns {string} Message describing unique constraint error.
     */
    message: (fields) => `Constraint error: [${fields.join(', ')}] field set must be unique`,
  },
};

module.exports = errorCodes;
