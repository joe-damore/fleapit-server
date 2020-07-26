const Sequelize = require('sequelize');
const mediaDb = require('../db/mediaDb.js');

class MediaMetadata extends Sequelize.Model {};

MediaMetadata.init({
  mediaId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: 'media',
      key: 'id',
    },
  },
  metadata: {
    type: Sequelize.JSON,
    allowNull: false,
  },
}, {
  sequelize: mediaDb,
  modelName: 'mediaMetadata',
});

module.exports = { model: MediaMetadata };
