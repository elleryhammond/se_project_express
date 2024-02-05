const ClothingItem = require("../models/clothingItem");

const createItem = (req, res) => {
  const { name, weather, imageURL } = req.body;
  ClothingItem.create({ name, weather, imageURL })
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      console.error(err);
      return res.status(400).send({ message: err.message });
    });
};

const getItems = (req, res) => {
  // const { name, weather, imageURL, owner, likes, createdAt } = req.body;
  ClothingItem.find({})
    .then((items) => res.status(200).send({ data: items }))
    .catch((err) => {
      console.error(err);
      return res.status(500).send({ message: err.message });
    });
};

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageURL } = req.body;

  ClothingItem.findByIdAndUpdate(itemId, { $set: { imageURL } })
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: err.message });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => res(204).send({}))
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

module.exports = { createItem, getItems, updateItem, deleteItem };
