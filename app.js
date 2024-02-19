const express = require("express");

const mongoose = require("mongoose");

const helmet = require("helmet");

const cors = require("cors");

const mainRouter = require("./routes/index");

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

app.use("/", mainRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
