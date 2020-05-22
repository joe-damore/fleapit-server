const express = require('express');

const app = express();
const port = 3000;

module.exports = async () => {
  // DBs
  const mediaDb = require('./db/mediaDb.js');

  // Models
  const models = require('./models');

  // Routers
  const usersRouter = require('./routes/users.js');

  await mediaDb.sync();

  app.use('/users', usersRouter);

  app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
  });
};
