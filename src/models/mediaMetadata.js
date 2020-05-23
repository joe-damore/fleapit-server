const Sequelize = require('sequelize');
const mediaDb = require('../db/mediaDb.js');

const MediaObject = require('./mediaObject.js');

class MediaMetadata extends Sequelize.Model {};

MediaMetadata.init({
  mediaObjectId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    unique: 'object-key-composite',
    references: {
      model: MediaObject,
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

module.exports = MediaMetadata;
