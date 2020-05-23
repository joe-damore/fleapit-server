const Sequelize = require('sequelize');
const mediaDb = require('../db/mediaDb.js');

class MediaCollection extends Sequelize.Model {};

MediaCollection.init({
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  parentCollection: {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: {
      model: MediaCollection,
      key: 'id',
    }
  },
}, {
  sequelize: mediaDb,
  modelName: 'mediaCollection',
});

module.exports = MediaCollection;
