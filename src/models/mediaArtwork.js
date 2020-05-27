const Sequelize = require('sequelize');
const mediaDb = require('../db/mediaDb.js');

// const Media = require('./media.js');

class MediaArtwork extends Sequelize.Model {};

MediaArtwork.init({
  mediaId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'media',
      key: 'id',
    },
  },
  format: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  url: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  tag: {
    type: Sequelize.STRING,
    allowNull: true,
  },
}, {
  indexes: [
    {
      unique: true,
      fields: ['mediaId', 'format', 'url'],
    },
    {
      unique: true,
      fields: ['mediaId', 'format', 'tag'],
    },
  ],
  sequelize: mediaDb,
  modelName: 'mediaArtwork',
});

module.exports = MediaArtwork;
