const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");

const {
  invalidDataError,
  unauthorizedError,
  notFoundError,
  conflictError,
  serverError,
} = require("../utils/errors");

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!email) {
        throw new Error("Enter A Valid Email Address");
      }
      if (user) {
        throw new Error("Email Already In Use");
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => {
      const response = user.toObject();
      delete response.password;
      res.status(201).send({ data: response });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(invalidDataError).send({ message: "Invalid Data" });
      }
      if (err.message === "Enter A Valid Email Address") {
        return res
          .status(invalidDataError)
          .send({ message: "Invalid Credentials" });
      }
      if (err.message === "Email Already In Use") {
        return res.status(conflictError).send({
          message: "This Email Is Associated With An Existing User",
        });
      }
      return res.status(serverError).send({ message: "Server Error" });
    });
};

const getCurrentUser = (req, res) => {
  // const { userId } = req.params;
  const userId = req.user._id;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("User Not Found"));
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.message === "User Not Found") {
        return res.status(notFoundError).send({ message: "User Not Found" });
      }
      return res.status(serverError).send({ message: "Server Error" });
    });
};

const updateCurrentUser = (req, res) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("User Not Found"));
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.message === "User Not Found") {
        res.status(notFoundError).send({ message: err.message });
      } else if (err.name === "ValidationError") {
        res.status(invalidDataError).send({ message: "Invalid Credentials" });
      } else {
        res.status(serverError).send({ message: "Server Error" });
      }
    });
};

const login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.staus(invalidDataError).send({ message: "Invalid Credentials" });
    return;
  }
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      // res.status(200).send({ data: token });
      res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "Incorrect Email Or Password") {
        res.status(unauthorizedError).send({ message: "Invalid Credentials" });
      } else {
        res.status(serverError).send({ message: "Server Error" });
      }
    });
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateCurrentUser,
};
