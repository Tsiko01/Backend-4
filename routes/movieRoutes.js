
const express = require("express");
const mongoose = require("mongoose");

const Movie = require("../models/Movie");
const Director = require("../models/Director");

const router = express.Router();

// ყველა ფილმი - ძებნა, ფილტრაცია, დალაგება, Pagination
router.get("/", async (req, res) => {
  try {
    const {
      search,
      genre,
      year,
      minRating,
      sort = "year",
      page = 1,
      limit = 5
    } = req.query;

    const filter = {};

    // სახელით ძებნა
    if (search) {
      filter.title = {
        $regex: search,
        $options: "i"
      };
    }

    // ჟანრით ფილტრაცია
    if (genre) {
      filter.genre = genre;
    }

    // წლით ფილტრაცია
    if (year) {
      filter.year = Number(year);
    }

    // მინიმალური რეიტინგი
    if (minRating) {
      filter.rating = { $gte: Number(minRating) };
    }

    const sortOptions = {
      year: { year: -1 },
      rating: { rating: -1 },
      title: { title: 1 }
    };

    const sortBy = sortOptions[sort] || sortOptions.year;

    const currentPage = Math.max(1, Number(page) || 1);
    const perPage = Math.min(50, Math.max(1, Number(limit) || 5));

    const movies = await Movie.find(filter)
      .populate("director")
      .sort(sortBy)
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

    const totalMovies = await Movie.countDocuments(filter);

    res.json({
      totalMovies,
      totalPages: Math.ceil(totalMovies / perPage),
      currentPage,
      movies
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Top 5 ყველაზე მაღალრეიტინგული ფილმი
router.get("/top-rated", async (req, res) => {
  try {
    const movies = await Movie.find()
      .populate("director")
      .sort({ rating: -1 })
      .limit(5);

    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ახალი ფილმის შექმნა Headers-იდან Director ID-ით
router.post("/", async (req, res) => {
  try {
    const directorId = req.headers.directorid;

    if (!directorId) {
      return res.status(400).json({
        message: "Director ID is required in headers"
      });
    }

    if (!mongoose.isValidObjectId(directorId)) {
      return res.status(400).json({
        message: "Invalid Director ID"
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

    const populatedMovie = await Movie.findById(movie._id)
      .populate("director");

    res.status(201).json(populatedMovie);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// კონკრეტული ფილმის წამოღება
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid movie ID" });
    }

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
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid movie ID" });
    }

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
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid movie ID" });
    }

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
