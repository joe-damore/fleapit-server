const Sequelize = require('sequelize');
const usersDb = require('../db/usersDb.js');

class User extends Sequelize.Model {};

User.init({
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  firstName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
}, {
  sequelize: usersDb,
  modelName: 'user',
});

module.exports = User;
