const dotenv = require('dotenv');
const databaseConnection = require('./config/database-connection');

const app = require('./app');

dotenv.config();

try {
  databaseConnection(() => {
    app.listen(process.env.PORT, () => {
      console.log(`APP running on PORT: ${process.env.PORT}`);
      console.log(`Ambiente de execucao: ${process.env.NODE_ENV}`);
    });
  });
} catch (error) {
  console.log('****> Database connection error. Application will not start.\n');
  console.error(error);
}
