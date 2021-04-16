const mongoose = require("mongoose");
const Joi = require("joi");
const validate = require("../middlewares/validate");

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  isGold: {
    type: Boolean,
    default: false
  },
  phone: {
    type: String,
    required: true,
    length: 10
  }
});

const Customer = mongoose.model("Customer", customerSchema);

function validateCustomer(customer) {
  const schema = Joi.object({
    name: Joi.string().min(5).required(),
    isGold: Joi.boolean(),
    phone: Joi.string().length(10).required()
  });
  return schema.validate(customer);
}

exports.Customer = Customer;
exports.validate = validate(validateCustomer);
