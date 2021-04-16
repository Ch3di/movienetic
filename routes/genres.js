const validateObjectId = require("../middlewares/validateObjectId");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const { Genre, validate } = require("../models/genre");
const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");

router.get("/", async (req, res) => {
  const genres = await Genre.find().sort("name");
  res.send({ genres });
});

router.post("/", [auth, validate], async (req, res) => {
  let genre = new Genre({ name: req.body.name });
  genre = await genre.save();
  return res.send(genre);
});

router.put("/:id", [validateObjectId, validate], async (req, res) => {
  const genre = await Genre.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    new: true
  });
  if (!genre)
    return res.status(404).send({
      error: true,
      reason: "The genre with the given ID is not found"
    });

  res.send(genre);
});

router.delete("/:id", [auth, admin, validateObjectId], async (req, res) => {
  const genre = await Genre.findByIdAndDelete(req.params.id);
  if (!genre)
    return res.status(404).send({
      error: true,
      reason: "The genre with the given ID is not found"
    });
  res.send(genre);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre)
    return res.status(404).send({
      error: true,
      reason: "The genre with the given ID is not found"
    });
  res.send(genre);
});

module.exports = router;
