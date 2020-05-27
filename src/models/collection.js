const Sequelize = require('sequelize');
const mediaDb = require('../db/mediaDb.js');

class Collection extends Sequelize.Model {};

Collection.init({
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  parentCollection: {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: {
      model: 'collections',
      key: 'id',
    }
  },
}, {
  sequelize: mediaDb,
  modelName: 'collection',
});

module.exports = Collection;
