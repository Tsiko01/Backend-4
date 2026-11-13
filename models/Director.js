
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

// ერთი რეჟისორი - ბევრი ფილმი
directorSchema.virtual("movies", {
  ref: "Movie",
  localField: "_id",
  foreignField: "director"
});

directorSchema.set("toJSON", { virtuals: true });
directorSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Director", directorSchema);
