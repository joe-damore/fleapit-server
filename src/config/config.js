const app = require('../app.js');

const fs = require('fs');
const path = require('path');

const defaultConfig = require('./config.default.json');
const configPath = app.config;

module.exports = {
  config: {},

  loadSync: function() {
    if (fs.existsSync(configPath)) {
      const data = fs.readFileSync(configPath, {
        encoding: 'utf-8',
      });
      this.config = JSON.parse(data);
    }
    else {
      this.config = defaultConfig;
    }
  },

  save: async function() {
    return fs.promises.writeFile(configPath, JSON.stringify(this.config, null, 1));
  },

  saveSync: function() {
    fs.writeFileSync(configPath, JSON.stringify(this.config, null, 1));
  }
};
