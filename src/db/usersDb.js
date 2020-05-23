const app = require('../app.js');
const { config } = require('../config/config.js');
const db = require('./db.js');
const path = require('path');

/**
 * Retrieve the filepath that should be used for the users database.
 */
const dbPath = (() => {
  if (config.db?.users) {
    return path.resolve(config.db.users);
  }
  return path.resolve(app.dirs.userData(), 'users.dat');
})();

/**
 * Return an instance for the users DB at the configured path.
 */
module.exports = db(dbPath);
