/**
 * Removes a property or array of properties from the given object.
 *
 * Useful for removing sensitive or unneeded information from a database object
 * before sending it in a response.
 *
 * @param {Object} obj - Object whose properties should be scrubbed.
 * @param {Array|string} properties - String or array of properties to scrub.
 *
 * @returns {Object} Copy of obj with properties scrubbed.
 */
const scrub = (obj, properties) => {
  const scrubProperties = (() => {
    if (Array.isArray(properties)) {
      return properties;
    }
    return [properties];
  })();

  let scrubbedObj = obj;
  scrubProperties.forEach((property) => {
    scrubbedObj[property] = undefined;
  });

  return scrubbedObj;
}

module.exports = scrub;
