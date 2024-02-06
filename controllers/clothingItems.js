const ClothingItem = require("../models/clothingItem");

const {
  invalidDataError,
  notFoundError,
  serverError,
} = require("../utils/errors");

const createItem = (req, res) => {
  const { name, weather, imageURL } = req.body;
  const owner = req.user._id;
  ClothingItem.create({ name, weather, imageURL, owner })
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        res.status(invalidDataError).send({ message: err.message });
      } else if (err.name === "ValidationError") {
        res.status(invalidDataError).send({ message: err.message });
      } else {
        res.status(serverError).send({ message: err.message });
      }
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send({ data: items }))
    .catch((err) => {
      console.error(err);
      res.status(serverError).send({ message: err.message });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => res(200).send({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        res.status(invalidDataError).send({ message: err.message });
      } else if (err.name === "CastError") {
        res.status(invalidDataError).send({ message: err.message });
      } else if (err.name === "DocumentNotFoundError") {
        res.status(notFoundError).send({ message: err.message });
      } else {
        res.status(serverError).send({ message: err.message });
      }
    });
};

const likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((item) => {
      res.status(200).send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        res.status(invalidDataError).send({ message: err.message });
      } else if (err.name === "CastError") {
        res.status(invalidDataError).send({ message: err.message });
      } else if (err.name === "DocumentNotFoundError") {
        res.status(notFoundError).send({ message: err.message });
      } else {
        res.status(serverError).send({ message: err.message });
      }
    });
};

const unlikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((item) => {
      res.status(200).send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        res.status(invalidDataError).send({ message: err.message });
      } else if (err.name === "CastError") {
        res.status(invalidDataError).send({ message: err.message });
      } else if (err.name === "DocumentNotFoundError") {
        res.status(notFoundError).send({ message: err.message });
      } else {
        res.status(serverError).send({ message: err.message });
      }
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  unlikeItem,
};
