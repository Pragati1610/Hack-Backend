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

const app = express();
// const expressSwagger = require('express-swagger-generator')(app);
// let options = {
//     swaggerDefinition: {
//         info: {
//             description: 'This is a sample server',
//             title: 'Swagger',
//             version: '1.0.0',
//         },
//         host: 'localhost:3000',
//         basePath: '/v1',
//         produces: [
//             "application/json",
//             "application/xml"
//         ],
//         schemes: ['http', 'https'],
//         securityDefinitions: {
//             JWT: {
//                 type: 'apiKey',
//                 in: 'header',
//                 name: 'Authorization',
//                 description: "",
//             }
//         }
//     },
//     basedir: __dirname, //app absolute path
//     files: ['./routes/**/*.js'] //Path to the API handle folder
// };
// expressSwagger(options)

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
app.use('/team', team);
app.use('/event', event);
app.use('/scores', scores);
app.use('/review', review);

module.exports = app;
