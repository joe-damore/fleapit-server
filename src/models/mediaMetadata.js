const Sequelize = require('sequelize');
const mediaDb = require('../db/mediaDb.js');

// const Media = require('./media.js');

class MediaMetadata extends Sequelize.Model {};

MediaMetadata.init({
  mediaId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    unique: 'object-key-composite',
    references: {
      model: 'media',
      key: 'id',
    },
  },
  key: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: 'object-key-composite',
  },
  value: {
    type: Sequelize.STRING,
    allowNull: false,
  },
}, {
  sequelize: mediaDb,
  modelName: 'mediaMetadata',
});

module.exports = { model: MediaMetadata };
