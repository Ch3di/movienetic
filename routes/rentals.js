const express = require("express");
const router = express.Router();
const Fawn = require("fawn");
const mongoose = require("mongoose");
const { Rental, validate } = require("../models/rental");
const { Movie } = require("../models/movie");
const { Customer } = require("../models/customer");

Fawn.init(mongoose);

router.get("/", async (req, res) => {
  const rentals = await Rental.find().sort("-dateOut");
  res.send({ rentals });
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error)
    return res
      .status(400)
      .send({ error: true, message: error.details[0].message });

  let customer = await Customer.findById(req.body.customerId);
  if (!customer)
    return res.status(404).send({
      error: true,
      message: "the specified customer does not exist"
    });

  let movie = await Movie.findById(req.body.movieId);
  if (!movie)
    return res.status(404).send({
      error: true,
      message: "the specified movie does not exist"
    });

  if (movie.numberInStock === 0)
    return res.status(404).send({
      error: true,
      message: "movie is not stock"
    });

  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate
    }
  });
  try {
    Fawn.Task()
      .save("rentals", rental)
      .update(
        "movies",
        { _id: movie._id },
        {
          $inc: {
            numberInStock: -1
          }
        }
      )
      .run();
    return res.send(rental);
  } catch (error) {
    return res
      .status(500)
      .send({ error: true, message: "something went wrong" });
  }
});

module.exports = router;
