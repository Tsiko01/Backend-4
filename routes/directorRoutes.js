
const express = require("express");
const mongoose = require("mongoose");

const Director = require("../models/Director");
const Movie = require("../models/Movie");

const router = express.Router();

// ყველა რეჟისორი თავისი ფილმებით
router.get("/", async (req, res) => {
  try {
    const directors = await Director.find().populate("movies");

    res.json(directors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// რეჟისორის შექმნა
router.post("/", async (req, res) => {
  try {
    const director = await Director.create(req.body);

    res.status(201).json(director);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// რეჟისორის სტატისტიკა
router.get("/:id/stats", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid director ID" });
    }

    const director = await Director.findById(req.params.id);

    if (!director) {
      return res.status(404).json({ message: "Director not found" });
    }

    const movies = await Movie.find({
      director: director._id
    }).sort({ year: 1 });

    res.json({
      director: director.name,
      totalMovies: movies.length,
      firstMovie: movies.length ? movies[0] : null,
      latestMovie: movies.length ? movies[movies.length - 1] : null,
      movies: movies
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// კონკრეტული რეჟისორი თავისი ფილმებით
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid director ID" });
    }

    const director = await Director.findById(req.params.id)
      .populate("movies");

    if (!director) {
      return res.status(404).json({ message: "Director not found" });
    }

    res.json(director);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// რეჟისორის განახლება
router.put("/:id", async (req, res) => {
  try {
    const director = await Director.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!director) {
      return res.status(404).json({ message: "Director not found" });
    }

    res.json(director);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// რეჟისორის წაშლა
router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid director ID" });
    }

    const director = await Director.findById(req.params.id);

    if (!director) {
      return res.status(404).json({ message: "Director not found" });
    }

    const moviesCount = await Movie.countDocuments({
      director: director._id
    });

    if (moviesCount > 0) {
      return res.status(400).json({
        message: "Cannot delete director who has movies",
        moviesCount
      });
    }

    await Director.findByIdAndDelete(req.params.id);

    res.json({ message: "Director deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
