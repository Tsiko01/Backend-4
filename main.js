const express = require("express");
const mongoose = require("mongoose");

const directorRoutes = require("./routes/directorRoutes");
const movieRoutes = require("./routes/movieRoutes");

const app = express();

app.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/moviesDB")
  .then(() => console.log("MongoDB Connected"))
  .catch((error) => console.log(error));

app.use("/directors", directorRoutes);
app.use("/movies", movieRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});