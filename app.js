const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const routes = require("./routes");

const { PORT = 3001 } = process.env;

const app = express();

// Connect to MongoDB
mongoose.connect(
  "mongodb://127.0.0.1:27017/wtwr_db",
  () => {
    // Replace console.log with proper logging (optional)
    console.info("Connected to DB");
  },
  (e) => console.error("DB error", e) // Replacing console.log for error logging
);

app.use(express.json());
app.use(cors());
app.use(routes);

// Start the server
app.listen(PORT, () => {
  console.info(`App is listening at ${PORT}`);
});
