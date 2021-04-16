const express = require("express");
const router = express.Router();
const { Customer, validate } = require("../models/customer");
const auth = require("../middlewares/auth");

router.get("/", async (req, res) => {
  const customers = await Customer.find().sort("name");
  res.send({ customers });
});

router.post("/", [auth, validate], async (req, res) => {
  let customer = new Customer({
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold
  });
  customer = await customer.save();
  return res.send({ customer });
});

module.exports = router;
