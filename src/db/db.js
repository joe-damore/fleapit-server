const Sequelize = require('sequelize');

/**
 * Returns a Sequelize instance for the given path.
 */
module.exports = (dbPath) => {
  return new Sequelize(null, null, null, {
    dialect: 'sqlite',
    storage: dbPath,
  });
};
