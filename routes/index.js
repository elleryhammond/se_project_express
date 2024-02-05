const router = require("express").Router();

const userRouter = require("./users");
const itemRouter = require("./clothingItems");
const { notFoundError } = require("../utils/errors");

router.use("/users", userRouter);
router.use("/items", itemRouter);

router.use((req, res) => {
  res.status(notFoundError).send({
    message: "Requested resource not found",
  });
});

module.exports = router;
