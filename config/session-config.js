const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const dotenv = require('dotenv');

dotenv.config();

const uri = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
const store = new MongoDBStore({
  uri,
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
