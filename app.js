const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");
const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to database");
  })
  .catch(console.error);

app.use(express.json());
app.use("/", mainRouter);

app.use((req, res, next) => {
  req.user = {
    _id: "65c166504f08a11ade2b418f",
  };
  next();
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
