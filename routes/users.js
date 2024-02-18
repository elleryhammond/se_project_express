const router = require("express").Router();

const { getCurrentUser } = require("../controllers/users");

router.get("/users/me", getCurrentUser);

// router.get("/", getUsers);
// router.get("/:userId", getUser);
// router.post("/", createUser);

module.exports = router;
