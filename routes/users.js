const router = require("express").Router();
const { getCurrentUser, updateCurrentUser } = require("../controllers/users");
const { handleAuthorization } = require("../middlewares/auth");

router.get("/me", getCurrentUser, handleAuthorization);
router.patch("/me", updateCurrentUser, handleAuthorization);

module.exports = router;
