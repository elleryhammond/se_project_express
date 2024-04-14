const router = require("express").Router();
const { getCurrentUser, updateCurrentUser } = require("../controllers/users");
const { handleAuthorization } = require("../middlewares/auth");
const { updateUserValidator } = require("../middlewares/validation");

router.get("/me", handleAuthorization, getCurrentUser);
router.patch(
  "/me",
  handleAuthorization,
  updateUserValidator,
  updateCurrentUser,
);

module.exports = router;
