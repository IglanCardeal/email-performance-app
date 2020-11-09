const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const url = require('../config/get-mongo-url');

const store = new MongoDBStore({
  url,
  databaseName: 'app-envio-email',
  collection: 'sessoes',

}, (error) => {
  if (error) console.log(error);
});

module.exports = () => ({
  name: 'session.sid',
  secret: ['78jfduu923bs1qpoiewa10xssd000212Wssadl9112'],
  resave: true,
  saveUninitialized: false,
  cookie: {
    path: '/',
    secure: 'auto',
    maxAge: 3600000,
    httpOnly: true,
    sameSite: true,
  },
  store,
});
