const dotenv = require('dotenv');
const databaseConnection = require('./src/config/database-connection');

const app = require('./src/app');

dotenv.config();

try {
  databaseConnection(() => {
    app.listen(process.env.PORT, process.env.HOST, () => {
      console.log(`APP running on PORT: ${process.env.PORT}`);
      console.log(`URL: http://localhost:${process.env.PORT}`);
      console.log(`Ambiente de execucao: ${process.env.NODE_ENV}`);
    });
  });
} catch (error) {
  console.log('****> Database connection error. Application will not start.\n');
  console.error(error);
}
