const router = require("express").Router();

router.get("/", () => console.log("GET items"));
router.get("/:itemId", () => console.log("GET items by ID"));
router.post("/", () => console.log("POST items"));

module.exports = router;
