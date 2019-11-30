const mongoose = require("mongoose");

const { Schema } = mongoose;

const Historic = new Schema({});

module.exports = mongoose.model("Historic", Historic);
