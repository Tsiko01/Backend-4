const mongoose = require("mongoose");

const directorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  nationality: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Director", directorSchema);