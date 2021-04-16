const express = require("express");
const router = express.Router();
const { Movie, validate } = require("../models/movie");
const { Genre } = require("../models/genre");
const auth = require("../middlewares/auth");

router.get("/", async (req, res) => {
  const movies = await Movie.find().sort("title");
  res.send({ movies });
});

router.post("/", [auth, validate], async (req, res) => {
  const genre = await Genre.findById(req.body.genreId);
  if (!genre)
    return res.status(404).send({
      error: true,
      message: "the specified genre does not exist"
    });

  let movie = new Movie({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate
  });
  movie = await movie.save();
  return res.send(movie);
});

module.exports = router;
