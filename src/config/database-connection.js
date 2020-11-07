const mongoose = require('mongoose');

const url = require('./get-mongo-url');

module.exports = async (callback) => {
  console.log('Mongodb url:', url);
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    return callback();
  } catch (error) {
    console.log(error);
    throw new Error(
      'Error to connect database! Check mongodb url and/or port.',
    );
  }
};
