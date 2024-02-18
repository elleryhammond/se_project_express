const router = require("express").Router();
const { handleAuthorization } = require("../middlewares/auth");

const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItems");

router.post("/", createItem, handleAuthorization);
router.get("/", getItems);
router.delete("/:itemId", deleteItem, handleAuthorization);
router.put("/:itemId/likes", likeItem, handleAuthorization);
router.delete("/:itemId/likes", unlikeItem, handleAuthorization);

module.exports = router;
