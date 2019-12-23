const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const url = require('./get-mongo-url');

const store = new MongoDBStore({
  url,
  collection: 'sessoes',
});

module.exports = () => ({
  name: 'projeto_redes2.sid',
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
