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
  const usersRouter = require('./routes/users.js');
  const mediaCollectionsRouter = require('./routes/mediaCollections.js');
  const mediaObjectsRouter = require('./routes/mediaObjects.js');

  // Sync database with models
  await Promise.all(dbs.map(async (db) => {
    return db.sync();
  }));

  app.use(cors());
  app.use(express.json());

  app.use('/users', usersRouter);
  app.use('/media-collections', mediaCollectionsRouter);
  app.use('/media-objects', mediaObjectsRouter);

  app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
  });
};
