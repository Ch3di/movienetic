const moment = require("moment");
const mongoose = require("mongoose");
const { Rental } = require("../../models/rental");
const { User } = require("../../models/user");
const { Movie } = require("../../models/movie");
const request = require("supertest");

describe("/api/returns", () => {
  let server;
  let rental;
  let token;
  let payload;

  const exec = () => {
    return request(server)
      .post("/api/returns")
      .set("x-auth-token", token)
      .send(payload);
  };

  beforeEach(async () => {
    server = require("../../index");
    token = new User().generateAuthToken();
    payload = {
      customerId: mongoose.Types.ObjectId(),
      movieId: mongoose.Types.ObjectId()
    };

    movie = new Movie({
      _id: payload.movieId,
      title: "123456",
      dailyRentalRate: 2,
      genre: { name: "12345" },
      numberInStock: 10
    });

    await movie.save();

    rental = new Rental({
      customer: {
        _id: payload.customerId,
        name: "12345",
        phone: "1234567899"
      },
      movie: {
        _id: payload.movieId,
        title: "12345",
        dailyRentalRate: 2
      }
    });
    await rental.save();
  });
  afterEach(async () => {
    await Rental.remove({});
    await Movie.remove({});
    await server.close();
  });

  it("should return 401 if the client is not logged in", async () => {
    token = "";
    const res = await exec();
    expect(res.status).toBe(401);
  });

  it("should return 400 if the customerId is not provided", async () => {
    delete payload.customerId;
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 400 if the movieId is not provided", async () => {
    delete payload.movieId;
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 404 if movie/customer rental does not exist", async () => {
    await Rental.remove({});
    const res = await exec();
    expect(res.status).toBe(404);
  });

  it("should return 400 if return is already processed", async () => {
    rental.dateReturned = new Date();
    await rental.save();
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 200 if we have a valid request", async () => {
    const res = await exec();
    expect(res.status).toBe(200);
  });

  it("should set the return date if input is valid", async () => {
    const res = await exec();
    const rentalInDb = await Rental.findById(rental._id);
    const diff = new Date() - rentalInDb.dateReturned;
    expect(diff).toBeLessThan(10 * 1000);
  });

  it("should set the rentalFee if input is valid", async () => {
    rental.dateOut = moment().add(-7, "days").toDate();
    await rental.save();
    const res = await exec();
    const rentalInDb = await Rental.findById(rental._id);
    const diff = new Date() - rentalInDb.dateReturned;
    expect(rentalInDb.rentalFee).toBe(14);
  });

  it("should increase the movie stock if input is valid", async () => {
    const res = await exec();

    const movieInDb = await Movie.findById(movie._id);
    expect(movieInDb.numberInStock).toBe(movieInDb.numberInStock + 1);
  });

  it("should return a rental if input is valid", async () => {
    const res = await exec();

    const rentalInDb = await Rental.findById(rental._id);

    expect(Object.keys(res.body)).toEqual(
      expect.arrayContaining([
        "dateOut",
        "dateReturned",
        "rentalFee",
        "customer",
        "movie"
      ])
    );
  });
});
