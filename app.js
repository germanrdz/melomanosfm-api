const express = require('express');
const cookieParser = require('cookie-parser');

require('./db/db');
require('dotenv').config();

// const usersRouter = require('./routers/users');
const statusRouter = require('./routers/status');
const spotifyAuthRouter = require('./routers/spotify-auth');

const port = process.env.PORT;
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes Middleware
app.use(statusRouter);
app.use(spotifyAuthRouter);
// app.use(usersRouter);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${port}`);
});
