const config = require('./config/config.js');
const fleapit = require('./fleapit.js');

config.loadSync();

fleapit();
