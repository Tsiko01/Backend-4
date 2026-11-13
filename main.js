
const express = require("express");
const mongoose = require("mongoose");

const directorRoutes = require("./routes/directorRoutes");
const movieRoutes = require("./routes/movieRoutes");

const app = express();

app.use(express.json());

// MongoDB connection
mongoose
  .connect("mongodb://127.0.0.1:27017/moviesDB")
  .then(() => {
    console.log("MongoDB Connected");

    app.listen(3000, () => {
      console.log("Server running on port 3000");
    });
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error);
  });

// Routes
app.use("/directors", directorRoutes);
app.use("/movies", movieRoutes);
