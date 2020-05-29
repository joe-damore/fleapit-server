const Sequelize = require('sequelize');
const mediaDb = require('../db/mediaDb.js');

class CollectionMedia extends Sequelize.Model {};

CollectionMedia.init({
  parentCollectionId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'collections',
      key: 'id',
    },
  },
  childMediaId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'media',
      key: 'id',
    },
  },
}, {
  sequelize: mediaDb,
  modelName: 'collectionMedia',
});

// const associations = (models) => {
//   CollectionMedia.hasOne(models.collections, { foreignKey: 'id', as: 'parentCollection' });
//   CollectionMedia.hasOne(models.media, { foreignKey: 'id', as: 'childCollection' });
// };

module.exports = {
  model: CollectionMedia,
//  associations,
};
