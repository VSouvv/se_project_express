const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRouter = require("./routes/index");

const { PORT = 3001 } = process.env;

// Connecting to the database
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

const app = express();

app.use(cors());

// Main router
app.use(express.json());
app.use("/", userRouter);

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
