const ClothingItem = require("../models/clothingItem");

const {
  invalidDataError,
  notFoundError,
  serverError,
} = require("../utils/errors");

const createItem = (req, res) => {
  const { name, weather, imageURL } = req.body;
  ClothingItem.create({ name, weather, imageURL })
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(invalidDataError).send({ message: err.message });
      } else if (err.name === "CastError") {
        return res.status(invalidDataError).send({ message: err.message });
      } else {
        return res.status(serverError).send({ message: err.message });
      }
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send({ data: items }))
    .catch((err) => {
      console.error(err);
      return res.status(serverError).send({ message: err.message });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => res(200).send({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(notFoundError).send({ message: err.message });
      } else if (err.name === "CastError") {
        return res.status(invalidDataError).send({ message: err.message });
      } else if (err.name === "ValidationError") {
        return res.status(invalidDataError).send({ message: err.message });
      }
      return res.status(serverError).send({ message: err.message });
    });
};

const likeItem = (req, res) => {};

const unlikeItem = (req, res) => {};

module.exports = { createItem, getItems, deleteItem, likeItem, unlikeItem };
