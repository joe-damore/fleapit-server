/**
 * @file Utilities to identify and validate input data.
 *
 * Because these functions are intended to be used to validate or otherwise
 * work with HTTP request data, the inputs are accepted as strings only.
 */

const input = {

  /**
   * Returns a numeric representation of the given string.
   *
   * If the given string cannot be represented as a number, null is returned
   * instead.
   *
   * @param {string} stringValue - String to convert to number.
   *
   * @return {number|null} Numeric representation of stringValue, or null.
   */
  toNumber: (stringValue) => {
    const numericValue = +stringValue;
    return (isNaN(numericValue) ? null : numericValue);
  },
};

module.exports = input;
