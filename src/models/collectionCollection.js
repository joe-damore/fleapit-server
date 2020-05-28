const Sequelize = require('sequelize');
const mediaDb = require('../db/mediaDb.js');

class CollectionCollection extends Sequelize.Model {};

CollectionCollection.init({
  parentCollectionId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'collections',
      key: 'id',
    },
  },
  childCollectionId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'collections',
      key: 'id',
    },
    validate: {
      isNotParentCollectionId: function(value) {
        if (value == this.parentCollectionId) {
          throw new Error('childCollectionId and parentCollectionId should not match');
        }
      },
    }
  },
}, {
  sequelize: mediaDb,
  modelName: 'collectionCollection',
});

CollectionCollection.hasOne('collections', { foreignKey: 'id', as: 'parentCollection' });
CollectionCollection.hasOne('collections', { foreignKey: 'id', as: 'childCollection' });

module.exports = CollectionCollection;
