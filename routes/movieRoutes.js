const express = require("express");
const Movie = require("../models/Movie");
const Director = require("../models/Director");

const router = express.Router();

// ყველა ფილმის წამოღება რეჟისორის სრული ინფორმაციით
router.get("/", async (req, res) => {
  try {
    const movies = await Movie.find().populate("director");
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ახალი ფილმის შექმნა
router.post("/", async (req, res) => {
  try {
    const directorId = req.headers.directorid;

    if (!directorId) {
      return res.status(400).json({
        message: "Director ID is required in headers"
      });
    }

    const director = await Director.findById(directorId);

    if (!director) {
      return res.status(404).json({
        message: "Director not found"
      });
    }

    const movie = await Movie.create({
      ...req.body,
      director: directorId
    });

    res.status(201).json(movie);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// კონკრეტული ფილმის წამოღება
router.get("/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id)
      .populate("director");

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ფილმის განახლება
router.put("/:id", async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate("director");

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.json(movie);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ფილმის წაშლა
router.delete("/:id", async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.json({ message: "Movie deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;