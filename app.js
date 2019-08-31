const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

require('./db/db');
require('dotenv').config();

const statusRouter = require('./routers/status');
const spotifyAuthRouter = require('./routers/spotify-auth');
const spotifyRouter = require('./routers/spotify');

const port = process.env.PORT;
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// Routes Middleware
app.use(statusRouter);
app.use(spotifyAuthRouter);
app.use(spotifyRouter);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${port}`);
});
