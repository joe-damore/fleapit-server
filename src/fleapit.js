const express = require('express');

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

  // Sync database with models
  await Promise.all(dbs.map(async (db) => {
    return db.sync();
  }));


  app.use('/users', usersRouter);

  app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
  });
};
