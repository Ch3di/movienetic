const Joi = require("joi");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const express = require("express");
const router = express.Router();
const { User } = require("../models/user");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user)
    return res
      .status(400)
      .send({ error: true, message: "invalid user or password" });

  const isValidPassword = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!isValidPassword)
    return res
      .status(400)
      .send({ error: true, message: "invalid user or password" });
  token = user.generateAuthToken();
  return res.send(token);
});

function validate(user) {
  const schema = Joi.object({
    email: Joi.string().min(5).required().email(),
    password: Joi.string().min(8).required()
  });
  return schema.validate(user);
}

module.exports = router;
