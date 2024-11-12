const { Router } = require("express");
const { getUsers, updateUser } = require("../controllers/users");
const { validateUserUpdate } = require("../middlewares/validation");
const auth = require("../middlewares/auth");

const router = Router();

router.use(auth);
// route to get user data
router.get("/me", getUsers);

// route to modify user data
router.patch("/me", validateUserUpdate, updateUser);

module.exports = router;
