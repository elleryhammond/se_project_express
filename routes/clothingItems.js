const router = require("express").Router();

const {
  createItem,
  getItems,
  // updateItem,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItems");

router.post("/", createItem);
router.get("/", getItems);
// router.put("/:itemId", updateItem);
router.delete("/:ItemId", deleteItem);
router.put("/:ItemId/likes", likeItem);
router.delete("/:ItemId/likes", unlikeItem);

module.exports = router;
