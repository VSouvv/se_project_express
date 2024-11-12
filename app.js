require("dotenv").config();
const express = require("express");

const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require("celebrate");
const routes = require("./routes");

const { PORT = 3001 } = process.env;

const app = express();

const errorHandler = require("./middlewares/error-handler");

const { requestLogger, errorLogger } = require("./middlewares/logger");

mongoose.connect(
  "mongodb://127.0.0.1:27017/wtwr_db",
  () => {
    console.log("connected to DB");
  },
  (e) => console.log("DB error", e)
);

app.use(express.json());

app.use(cors());

// request logger BEFORE all route handlers
app.use(requestLogger);

// server crash testing
app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

// routes
app.use(routes);

// error logger is enabled AFTER route handlers and BEFORE error handlers

app.use(errorLogger);

// celebrate error handler
app.use(errors());

// centralized error handler
app.use(errorHandler);

// app.use("/users", userRouter);

app.listen(PORT, () => {
  console.log(`App is listening at ${PORT}`);
  console.log("This is working!");
});
