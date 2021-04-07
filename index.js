const winston = require("winston");
require("winston-mongodb");
require("express-async-errors");
const error = require("./middlewares/error");
const config = require("config");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
const express = require("express");
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");
const users = require("./routes/users");
const auth = require("./routes/auth");

const app = express();

winston.add(
  new winston.transports.File({
    filename: "logfile.log",
    handleExceptions: true,
    handleRejections: true
  })
);

winston.add(
  new winston.transports.MongoDB({
    db: "mongodb://localhost/movienetic",
    level: "error",
    handleExceptions: true,
    handleRejections: true
  })
);

if (!config.get("jwtPrivateKey")) {
  console.log("ERROR: JWT private key is not set");
  process.exit(1);
}

mongoose
  .connect("mongodb://localhost/movienetic", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("connected to mongodb..."))
  .catch("could not connect to mongodb...");

app.use(express.json());
app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);
app.use("/api/users", users);
app.use("/api/auth", auth);
app.use(error);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
