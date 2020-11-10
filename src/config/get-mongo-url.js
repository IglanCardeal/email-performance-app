const dotenv = require('dotenv');

dotenv.config();

const HOST =
  process.env.NODE_ENV === 'production'
    ? process.env.DB_HOST
    : process.env.DB_DEV_HOST;
const PORT = process.env.DB_PORT;
const DBNAME = process.env.DB_NAME;
// const USERNAME = process.env.DB_USERNAME;
// const PASSWORD = process.env.DB_PASSWORD;
const external_url = process.env.DB_HOST_EXTERNAL;

const url = external_url ? external_url : `mongodb://${HOST}:${PORT}/${DBNAME}`;

module.exports = url;
