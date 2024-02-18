const mongoose = require("mongoose");
const validator = require("validator");
// const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    required: true,
    type: String,
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL",
    },
  },
  email: {
    required: true,
    unique: true,
    type: String,
    validate: {
      validator(value) {
        return validator.isEmail(value);
      },
      message: "You must enter a valid email address",
    },
  },
  password: {
    required: true,
    type: String,
    minlength: 8,
    select: false,
  },
});

module.exports = mongoose.model("user", userSchema);
