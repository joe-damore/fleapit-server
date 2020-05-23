const Sequelize = require('sequelize');
const mediaDb = require('../db/mediaDb.js');

class MediaMetadata extends Sequelize.Models {};

MediaMetadata.init({
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  sortTitle: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  description: {
    type: Sequelize.STRING,
    allowNull: true,
  },
}, {
  sequelize: mediaDb,
  modelName: 'mediaMetadata',
});

module.exports = MediaMetadata;
