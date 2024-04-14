const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const NotFoundError = require("../utils/errors/NotFoundError");
const BadRequestError = require("../utils/errors/BadRequestError");
const UnauthorizedError = require("../utils/errors/UnauthorizedError");
const ConflictError = require("../utils/errors/ConflictError");

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;
  User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!email) {
        return next(new BadRequestError("Enter A Valid Email Address"));
      }
      if (user) {
        return next(new ConflictError("Email Already In Use"));
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
        next(new BadRequestError("Invalid Data"));
      } else if (err.message === "Enter A Valid Email Address") {
        next(new BadRequestError("Invalid Credentials"));
      } else if (err.message === "Email Already In Use") {
        next(
          new ConflictError("This Email Is Associated With An Existing User"),
        );
      } else {
        next(err);
      }
    });
};

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError("User Not Found"));
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      console.error(err);
      next(err);
    });
};

const updateCurrentUser = (req, res, next) => {
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
        return next(new NotFoundError("User Not Found"));
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "User Not Found") {
        next(new NotFoundError("User Not Found"));
      } else if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid Credentials"));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new BadRequestError("Invalid Credentials"));
  }
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "Incorrect Email Or Password") {
        next(new UnauthorizedError("Invalid Credentials"));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createUser,
  getCurrentUser,
  updateCurrentUser,
  login,
};
