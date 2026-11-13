const express = require("express");
const Director = require("../models/Director");

const router = express.Router();

// ყველა რეჟისორის წამოღება თავისი ფილმებით
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

// კონკრეტული რეჟისორის წამოღება
router.get("/:id", async (req, res) => {
  try {
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
    const director = await Director.findByIdAndDelete(req.params.id);

    if (!director) {
      return res.status(404).json({ message: "Director not found" });
    }

    res.json({ message: "Director deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;