const Sequelize = require('sequelize');
const mediaDb = require('../db/mediaDb.js');

const MediaArtwork = require('../models/mediaArtwork.js');
const MediaMetadata = require('../models/mediaMetadata.js');

class Media extends Sequelize.Model {};

Media.init({
  name: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  url: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  checksum: {
    type: Sequelize.STRING,
    allowNull: false,
  },
}, {
  sequelize: mediaDb,
  modelName: 'media',
});

const associations = (models) => {
  Media.hasMany(models.mediaArtwork, {foreignKey: 'mediaId', as: 'artwork', onDelete: 'cascade'});
  Media.hasOne(models.mediaMetadata, {foreignKey: 'mediaId', as: 'metadata', onDelete: 'cascade'});
};

module.exports = { model: Media, associations }
