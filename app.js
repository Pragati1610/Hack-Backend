const express = require('express');
const compression = require('compression');
const db = require('./db/db');
const cors = require('cors');

require('./models/relations');

const dotenv = require('dotenv');
dotenv.config();

const morgan = require('./logging/morgan');

const auth = require('./routes/auth');
const team = require('./routes/team');
const event = require('./routes/events');
const scores = require('./routes/scores');
const review = require('./routes/review');
const p_t = require('./routes/participantTeam');
const comments = require('./routes/comments');
// const testMail = require('./routes/testMail');

const app = express();

// connection
app.locals.db = db;

// Middlewares
app.use(express.json());
app.use(compression());
app.use(cors());

// Logging
app.use(morgan);

// Mount routes
app.use('/auth', auth);
app.use('/event', event);
app.use('/participantTeam', p_t);
app.use('/team', team);
app.use('/scores', scores);
app.use('/review', review);
app.use('/comments', comments);
// app.use('/mail', testMail);

module.exports = app;