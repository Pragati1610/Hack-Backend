const express = require('express');
const compression = require('compression');
const db = require('./db/db');

const dotenv = require("dotenv");
dotenv.config();

const morgan = require('./logging/morgan');

const auth = require('./routes/auth');

const app = express();

app.locals.db = db;

// Middlewares
app.use(express.json());
app.use(compression());

// Logging
app.use(morgan);

// Mount routes
app.use('/auth', auth);

module.exports = app;
