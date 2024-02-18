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

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      console.error(err);
      return res.status(serverError).send({ message: "Server Error" });
    });
};

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new Error("Email Already In Use");
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => User.create({ name, avatar, email, password: hash }).then(
        (newUser) => {
          const response = newUser.toObject();
          delete response.password;
          res.status(200).send({ data: response });
        },
      ))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(invalidDataError).send({ message: "Invalid Data" });
      }
      if (err.name === "CastError") {
        return res.status(invalidDataError).send({ message: "Invalid Data" });
      }
      if (err.message === "Email Already In Use") {
        return res.status(conflictError).send({
          message: "This Email Is Associated With An Existing User",
        });
      }
      return res.status(serverError).send({ message: "Server Error" });
    });
};

// const createUser = (req, res) => {
//   const { name, avatar, email, password } = req.body;
//   User.create({ name, avatar, email, password })
//     .then((user) => res.send(user))
//     .catch((err) => {
//       console.error(err);
//       if (err.name === "ValidationError") {
//         return res.status(invalidDataError).send({ message: "Invalid Data" });
//       }
//       if (err.name === "CastError") {
//         return res.status(invalidDataError).send({ message: "Invalid Data" });
//       }
//       if (err.message === "Email already in use") {
//         return res.status(conflictError).send({
//           message: "This email is associated with an existing user account",
//         });
//       }
//       return res.status(serverError).send({ message: "Server Error" });
//     });
// };

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(notFoundError)
          .send({ message: "Requested Resource Not Found" });
      }
      if (err.name === "CastError") {
        return res.status(invalidDataError).send({ message: "Invalid Data" });
      }
      if (err.name === "ValidationError") {
        return res.status(invalidDataError).send({ message: "Invalid Data" });
      }
      return res.status(serverError).send({ message: "Server Error" });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(200).send({ data: token });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "Incorrect Email Or Password") {
        res
          .status(unauthorizedError)
          .send({ message: "Incorrect Email Or Password" });
      } else {
        res.status(serverError).send({ message: "Server Error" });
      }
    });
};

module.exports = { getUsers, createUser, getUser, login };
