const router = require("express").Router();

const userRouter = require("./users");
const itemRouter = require("./clothingItems");
const { login, createUser } = require("../controllers/users");
const NotFoundError = require("../utils/errors/NotFoundError");
const {
  loginUserValidator,
  createUserValidator,
} = require("../middlewares/validation");

router.use("/users", userRouter);
router.use("/items", itemRouter);

router.post("/signin", loginUserValidator, login);
router.post("/signup", createUserValidator, createUser);

router.use((req, res, next) => {
  next(new NotFoundError("Requested Resource Not Found"));
});

module.exports = router;
