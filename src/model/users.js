const mongoose = require("mongoose");

const { Schema } = mongoose;

const User = new Schema({});

module.exports = mongoose.model("User", User);
