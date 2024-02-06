const User = require("../models/user");

const {
  invalidDataError,
  notFoundError,
  serverError,
} = require("../utils/errors");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.error(err);
      return res.status(serverError).send({ message: "Server Error" });
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(invalidDataError).send({ message: "Invalid Data" });
      } else if (err.name === "CastError") {
        return res.status(invalidDataError).send({ message: "Invalid Data" });
      }
      return res.status(serverError).send({ message: "Server Error" });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(notFoundError)
          .send({ message: "Requested Resource Not Found" });
      } else if (err.name === "CastError") {
        return res.status(invalidDataError).send({ message: "Invalid Data" });
      } else if (err.name === "ValidationError") {
        return res.status(invalidDataError).send({ message: "Invalid Data" });
      }
      return res.status(serverError).send({ message: "Server Error" });
    });
};

module.exports = { getUsers, createUser, getUser };
