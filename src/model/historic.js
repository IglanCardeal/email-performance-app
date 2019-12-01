const mongoose = require("mongoose");

const { Schema } = mongoose;

const Historic = new Schema({
  data: {
    type: String,
    required: true
  },
  destino: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: false,
    default: "waiting"
  },
  time: {
    type: Number,
    required: false,
    default: 0
  },
  protocol: {
    type: String,
    required: false,
    default: "HTTP"
  }
});

module.exports = mongoose.model("historic", Historic);
