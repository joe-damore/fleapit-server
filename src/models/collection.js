const Sequelize = require('sequelize');
const mediaDb = require('../db/mediaDb.js');

const CollectionCollections = mediaDb.models.CollectionCollections;

class Collection extends Sequelize.Model {};

Collection.init({
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  //parentCollection: {
  //  type: Sequelize.INTEGER,
  //  allowNull: true,
  //  references: {
  //    model: 'collections',
  //    key: 'id',
  //  }
  //},
}, {
  sequelize: mediaDb,
  modelName: 'collection',
});

Collection.hasMany('collectionCollections', {foreignKey: 'childCollectionId', as: 'collections' });
Collection.hasMany('collectionMedia', {foreignKey: 'childMediaId', as: 'media'});

module.exports = Collection;
