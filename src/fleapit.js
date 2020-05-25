const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

module.exports = async () => {
  // DBs
  const dbs = [
    require('./db/mediaDb.js'),
    require('./db/usersDb.js'),
  ];

  // Models
  const models = require('./models');

  // Routers
  const artworkRouter = require('./routes/artwork.js');
  const collectionsRouter = require('./routes/collections.js');
  const mediaRouter = require('./routes/media.js');
  const usersRouter = require('./routes/users.js');

  // Sync database with models
  await Promise.all(dbs.map(async (db) => {
    return db.sync();
  }));

  app.use(cors());
  app.use(express.json());

  app.use('/artwork', artworkRouter);
  app.use('/collections', collectionsRouter);
  app.use('/media', mediaRouter);
  app.use('/users', usersRouter);

  app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
  });
};
