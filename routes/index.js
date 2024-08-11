const router = require("express").Router();
const { NOT_FOUND } = require("../utils/errors");

const userRouter = require("./users");
const itemRouter = require("./clothingItem");

router.use("/users", userRouter);
router.use("/items", itemRouter);

router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Resource not found" });
});

module.exports = router;
