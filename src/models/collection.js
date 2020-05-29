const Sequelize = require('sequelize');
const mediaDb = require('../db/mediaDb.js');

class Collection extends Sequelize.Model {};

Collection.init({
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
}, {
  sequelize: mediaDb,
  modelName: 'collection',
});

const associations = (models) => {
  Collection.hasMany(models.CollectionCollection, {foreignKey: 'childCollectionId', as: 'collections'});
  Collection.hasMany(models.CollectionMedia, {foreignKey: 'childMediaId', as: 'media'});
};

module.exports = {
  model: Collection,
  associations,
};
