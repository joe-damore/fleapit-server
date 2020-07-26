/**
 * @file Collection of utilities to handle key/value pairs.
 */

/**
 * Object containing key/value utility functions.
 */
const keyValue = {

  /**
   * Flattens a key/value pair, or array of key/value pairs, into an object.
   *
   * By default, each key value pair is expected to be an object with a "key"
   * property and a "value" property, but this can be configured using the
   * options parameter.
   *
   * @param {Object|Array} keyValue - Key/value pair, or array of pairs.
   * @param {Object=} options - Options object.
   * @param {string=} options.keyName - Name of key property in key/value pair.
   * @param {string=} options.valueName - Name of value property in key/value pair.
   *
   * @returns {Object} Object whose properties correspond to key/value pair.
   */
  toObject: (keyValue, options = {}) => {
    const kv = Array.isArray(keyValue) ? keyValue : [keyValue];
    const keyName = options.keyName ?? 'key';
    const valueName = options.valueName ?? 'value';

    return kv.reduce((acc, cur) => {
      const key = cur[keyName];
      const value = cur[valueName];

      let output = acc;
      output[key] = value;
      return output;
    }, {});
  },

  /**
   * Returns an array of key/value pairs from the given object's properties.
   *
   * @param {Object} obj - Object from which to retrieve key/value pairs.
   * @param {Object=} options - Options object.
   * @param {string=} options.keyName - Name of key property in key/value pair.
   * @param {string=} options.valueName - Name of value property in key/value pair.
   *
   * @returns {Array} Array of key/value pair objects.
   */
  fromObject: (obj, options = {}) => {
    const keyName = options.keyName ?? 'key';
    const valueName = options.valueName ?? 'value';

    return Object.keys(obj).reduce((acc, cur) => {
      const key = cur;
      const value = obj[key];

      const keyValue = {}
      keyValue[keyName] = key;
      keyValue[valueName] = value;

      const output = acc;
      output.push(keyValue);
      return output;
    }, []);
  },

};

module.exports = keyValue;
