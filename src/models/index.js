const Collection = require('./collection.js');
const CollectionCollection = require('./collectionCollection.js');
const CollectionMedia = require('./collectionMedia.js');
const Media = require('./media.js');
const MediaArtwork = require('./mediaArtwork.js');
const MediaMetadata = require('./mediaMetadata.js');
const User = require('./user.js');

const models = {
  Collection,
  CollectionCollection,
  CollectionMedia,
  Media,
  MediaArtwork,
  MediaMetadata,
  User,
};

/**
 * Initialize associations.
 */
Object.keys(models).forEach((key) => {
  const model = models[key];
  const association = model.associations;
  const sequelize = model.model.sequelize;

  if (association && typeof association === 'function') {
    association(sequelize.models);
  }
});

/**
 * Re-export models only.
 */
const exportedModels = Object.keys(models).reduce((acc, cur) => {
  const model = models[cur].model;
  const output = acc;

  output[cur] = model;
  return output;
}, {});

module.exports = exportedModels;
