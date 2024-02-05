const router = require("express").Router();

const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItems");

router.post("/", createItem);
router.get("/", getItems);
router.delete("/:ItemId", deleteItem);
router.put("/:ItemId/likes", likeItem);
router.delete("/:ItemId/likes", unlikeItem);

module.exports = router;
