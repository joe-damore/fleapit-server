const collection = require('./collection.js');
const collectionCollection = require('./collectionCollection.js');
const collectionMedia = require('./collectionMedia.js');
const media = require('./media.js');
const mediaArtwork = require('./mediaArtwork.js');
const mediaMetadata = require('./mediaMetadata.js');
const user = require('./user.js');

const models = {
  collection,
  collectionCollection,
  collectionMedia,
  media,
  mediaArtwork,
  mediaMetadata,
  user,
};

/**
 * Initialize associations.
 */
Object.keys(models).forEach((key) => {
  const model = models[key];
  const association = model.association;
  const sequelize = model.model.sequelize;

  if (association && typeof association === 'function') {
    association(sequelize.models);
  }
});

/**
 * Re-export models only.
 */
const exportedModels = Object.keys(models).reduce((acc, cur) => {
  const model = models[cur];
  const output = acc;

  output[cur] = model;
  return output;
}, {});

/**
 * Re-export models only.
 */
module.exports = exportedModels;
