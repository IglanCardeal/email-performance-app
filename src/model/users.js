const mongoose = require('mongoose');

const { Schema } = mongoose;

const User = new Schema({
  user: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

module.exports = mongoose.model('user', User);
