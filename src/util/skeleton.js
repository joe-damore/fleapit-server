/**
 * Default array of fields that should not be included in skeleton output.
 */
const hiddenFields = [
  'id',
  'createdAt',
  'updatedAt',
];

/**
 * Returns an object containing the fields of a given model with null values.
 *
 * @param {Object} model - Sequelize Model class from which to create skeleton.
 * @param {Object} options - (Optional) Options to customize skeleton.
 *
 * @returns {Object} Skeleton for model.
 */
const skeleton = (model, options = {}) => {
  const includeHiddenFields = options.includeHiddenFields || false;
  const hiddenFieldsArray = options.hiddenFields || hiddenFields;
  const value = options.value || null;

  let skeletonOutput = {};

  Object.keys(model.rawAttributes).forEach((field) => {
    // Short-circuit if field is a 'hidden' field.
    if (hiddenFieldsArray.includes(field) && !includeHiddenFields) {
      return;
    }

    skeletonOutput[field] = value;
  });

  return skeletonOutput;
};

module.exports = skeleton;
