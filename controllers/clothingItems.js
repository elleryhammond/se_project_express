const ClothingItem = require("../models/clothingItem");

const {
  invalidDataError,
  forbiddenError,
  notFoundError,
  serverError,
} = require("../utils/errors");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;
  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        res.status(invalidDataError).send({ message: "Invalid Data" });
      } else if (err.name === "ValidationError") {
        res.status(invalidDataError).send({ message: "Invalid Data" });
      } else {
        res.status(serverError).send({ message: "Server Error" });
      }
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.send({ data: items }))
    .catch((err) => {
      console.error(err);
      res.status(serverError).send({ message: "Server Error" });
    });
};

const deleteItem = (req, res) => {
  ClothingItem.findByIdAndDelete(req.params.itemId)
    .orFail()
    .then((item) => {
      if (!item.owner.equals(req.user._id)) {
        throw new Error("User Not Authorized To Delete Item");
      }
      return item.deleteOne().then(() => {
        res.status(200).send({ data: item, message: "Item Deleted" });
      });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        res.status(invalidDataError).send({ message: "Invalid Data" });
      } else if (err.name === "DocumentNotFoundError") {
        res
          .status(invalidDataError)
          .send({ message: "Requested Resource Not Found" });
      } else if (err.message === "User Not Authorized To Delete Item") {
        res
          .status(forbiddenError)
          .send({ message: "User Not Authorized To Delete Item" });
      } else {
        res.status(serverError).send({ message: "Server Error" });
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
      res.send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        res.status(invalidDataError).send({ message: "Invalid Data" });
      } else if (err.name === "DocumentNotFoundError") {
        res
          .status(notFoundError)
          .send({ message: "Requested Resource Not Found" });
      } else {
        res.status(serverError).send({ message: "Server Error" });
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
      res.send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        res.status(invalidDataError).send({ message: "Invalid Data" });
      } else if (err.name === "DocumentNotFoundError") {
        res
          .status(notFoundError)
          .send({ message: "Requested Resource Not Found" });
      } else {
        res.status(serverError).send({ message: "Server Error" });
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
