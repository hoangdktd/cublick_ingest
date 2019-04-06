/**
 * Module dependencies.
 */
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const logger = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');
const fs = require('fs');
const expressValidator = require('express-validator');
const expressStatusMonitor = require('express-status-monitor');
const lusca = require('lusca');

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
// dotenv.load({ path: '.env.example' });

/**
 * Controllers (route handlers).
 */
// const homeController = require('./controllers/home');

/**
 * load configuration.
 */
const cublickIngestConfig = require('./config/config');

/**
 * Create Express server.
 */
const app = express();

global.CUBLICK_INGEST = {};

global.CUBLICK_INGEST.SAminId = '';
global.CUBLICK_INGEST.AnonymousId = '';
global.CUBLICK_INGEST.rootPath = __dirname;
global.CUBLICK_INGEST.Config = {};

/**
 * Connect to MongoDB.
 */
mongoose.Promise = global.Promise;
mongoose.connect(cublickIngestConfig.mongodb.uri);

// HTTP Logger
const logDir = path.join(global.CUBLICK_INGEST.rootPath, 'logs');
fs.existsSync(logDir) || fs.mkdirSync(logDir);

/**
 * Express configuration.
 */

 // get all data/stuff of the body (POST) parameters
// parse application/json
app.use(bodyParser.json());
// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());


// Solve CORS related: Ref http://stackoverflow.com/questions/7067966/how-to-allow-cors-in-express-nodejs
app.all('/*', [require('./middlewares/allowCrossDomain')]);

// Auth Middleware - This will check if the token is valid
// app.all('/auth/*', [require('./app/middlewares/validateRequest')]);

// Routes ==================================================
require('./routes/routes')(app); // configure our routes

// Create App
const server = require('http').createServer(app);

// Start App: http://IP_Address:port
server.listen(cublickIngestConfig.port, function () {
    console.log('CUBLICK_INGEST server listening on port %d', cublickIngestConfig.port);
});

// expose app
module.exports = app;
