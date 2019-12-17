const { join } = require('path');

const generateLogErrors = require('./errors-log-handler');

module.exports = (error, req, res, next) => {
  const filepath = join(__dirname, '../logs/errors.log');

  generateLogErrors(error, filepath, error.statusCode);

  res.render('error', {
    pageTitle: 'Error',
    path: '',
    isLogged: req.session.isLogged,
  });
};
