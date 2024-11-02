const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const routes = require("./routes");

const { PORT = 3001 } = process.env;

const app = express();

const errorHandler = require("./middlewares/error-handler");

mongoose.connect(
  "mongodb://127.0.0.1:27017/wtwr_db",
  () => {
    console.log("connected to DB");
  },
  (e) => console.log("DB error", e)
);

app.use(express.json());
app.use(cors());
app.use(routes);
app.use(errorHandler);

// app.use("/users", userRouter);

app.listen(PORT, () => {
  console.log(`App is listening at ${PORT}`);
  console.log("This is working!");
});
