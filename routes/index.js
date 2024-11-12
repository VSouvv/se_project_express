const router = require("express").Router();

const clothingRouter = require("./clothingItems");

const userRouter = require("./users");
const { login, createUser } = require("../controllers/users");

const {
  validateUserInfo,
  validateUserAuthentication,
} = require("../middlewares/validation");

const NotFoundError = require("../errors/not-found-err");

router.use("/items", clothingRouter);
router.use("/users", userRouter);
router.post("/signin", validateUserAuthentication, login);
router.post(
  "/signup",
  validateUserInfo,
  // validateURL,
  createUser
);

router.use((req, res, next) => {
  next(new NotFoundError("Requested resource not found"));
});
module.exports = router;
