const express = require("express");

const mongoose = require("mongoose");

const helmet = require("helmet");

const mainRouter = require("./routes/index");

const app = express();

const { PORT = 3001 } = process.env;

const { createUser, login } = require("./controllers/users");

mongoose.set("strictQuery", true);

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to database");
  })
  .catch(console.error);

app.use((req, res, next) => {
  req.user = {
    _id: "65c1692ef6cd97603e008d84",
  };
  next();
});

app.use(express.json());

app.use(helmet());

app.use("/", mainRouter);

app.post("/signin", login);

app.post("/signup", createUser);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
