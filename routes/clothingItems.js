const router = require("express").Router();
const { handleAuthorization } = require("../middlewares/auth");

const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItems");

const {
  createCardValidator,
  validateId,
} = require("../middlewares/validation");

router.post("/", handleAuthorization, createCardValidator, createItem);
router.get("/", getItems);
router.delete("/:itemId", handleAuthorization, validateId, deleteItem);
router.put("/:itemId/likes", handleAuthorization, validateId, likeItem);
router.delete("/:itemId/likes", handleAuthorization, validateId, unlikeItem);

module.exports = router;
