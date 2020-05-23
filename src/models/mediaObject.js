const Sequelize = require('sequelize');
const mediaDb = require('../db/mediaDb.js');

const MediaCollection = require('./mediaCollection.js');

class MediaObject extends Sequelize.Model {};

MediaObject.init({
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
  collection: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: MediaCollection,
      key: 'id',
    },
  }
}, {
  sequelize: mediaDb,
  modelName: 'mediaObject',
});

module.exports = MediaObject;
