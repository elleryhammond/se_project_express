const router = require("express").Router();
const { getCurrentUser, updateCurrentUser } = require("../controllers/users");
const { handleAuthorization } = require("../middlewares/auth");

router.get("/me", handleAuthorization, getCurrentUser);
router.patch("/me", handleAuthorization, updateCurrentUser);

module.exports = router;
