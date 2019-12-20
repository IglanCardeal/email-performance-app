global.Promise = require('bluebird');

const { join } = require('path');
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const csurf = require('csurf');
const session = require('express-session');

const allRoutes = require('./src/routes/all-routes');

const serverErrorHandler = require('./errors/server-error-handler');

const sessionObject = require('./config/session-config');
const checkCsrfToken = require('./config/check-csrf-token');

const app = express();

app.set('view engine', 'ejs');
app.set('views', join(__dirname, './src/views'));

app.use(helmet());
app.use(session(sessionObject()));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(csurf());
app.use(checkCsrfToken);
app.use(express.static(join(__dirname, './src/public')));
app.use(allRoutes);
app.use(serverErrorHandler);

module.exports = app;
