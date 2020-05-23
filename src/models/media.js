const Sequelize = require('sequelize');
const mediaDb = require('../db/mediaDb.js');

const Collection = require('./collection.js');

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
  collection: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: Collection,
      key: 'id',
    },
  }
}, {
  sequelize: mediaDb,
  modelName: 'media',
});

module.exports = Media;
