
const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  genre: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
    default: 5
  },
  director: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Director",
    required: true
  }
});

module.exports = mongoose.model("Movie", movieSchema);
