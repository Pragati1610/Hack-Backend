const express = require('express');
const compression = require('compression');
const db = require('./db/db').default;
const cors = require('cors');
const rateLimit = require("express-rate-limit");

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
const convertToFile = require('./routes/convertToFile');
// const sendMailsToQualified = require('./routes/sendMailsToQualified');

const app = express();

// connection
app.locals.db = db;

app.set('trust proxy', 1);

const limiter = rateLimit({
    windowMs: process.env.RATE_LIMITTING_TIME, // 15 minutes
    max: process.env.RATE_LIMITTING_MAX
});

//  apply to all requests

// Middlewares
app.use(express.json());
app.use(compression());
app.use(cors());
app.use(limiter);

// Logging
app.use(morgan);

app.get('/', (req, res) => {
    const timestamp = Math.floor(Date.now() / 1000);
    res.send({ message: "Version 1.6", timestamp });
});

// Mount routes
app.use('/auth', auth);
app.use('/event', event);
app.use('/participantTeam', p_t);
app.use('/team', team);
app.use('/scores', scores);
app.use('/review', review);
app.use('/comments', comments);
app.use('/convertToFile', convertToFile);
// app.use('/sendMailsToQualified', sendMailsToQualified);

module.exports = app;