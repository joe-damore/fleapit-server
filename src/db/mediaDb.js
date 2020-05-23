const app = require('../app.js');
const { config } = require('../config/config.js');
const db = require('./db.js');
const path = require('path');

/**
 * Retrieve the filepath that should be used for the media object database.
 */
const dbPath = (() => {
  if (config.db?.media) {
    return path.resolve(config.db.media);
  }
  return path.resolve(app.dirs.userData(), 'media.dat');
})();

/**
 * Return an instance for the media DB at the configured path.
 */
module.exports = db(dbPath);
