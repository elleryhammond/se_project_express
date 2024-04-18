require("dotenv").config();

const express = require("express");

const mongoose = require("mongoose");

const helmet = require("helmet");

const cors = require("cors");

const { errors } = require("celebrate");

const mainRouter = require("./routes/index");

const errorHandler = require("./middlewares/errorHandler");

const { requestLogger, errorLogger } = require("./middlewares/logger");

const app = express();
const { PORT = 3001 } = process.env;

mongoose.set("strictQuery", true);
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to database");
  })
  .catch(console.error);

app.use(express.json());

app.use(helmet());
app.use(cors());

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

app.use(requestLogger);

app.use("/", mainRouter);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
