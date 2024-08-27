const router = require("express").Router();
const { updateUser, getCurrentUser } = require("../controllers/users");
const auth = require("../middleware/auth");

router.patch("/me", auth, updateUser);
router.get("/me", auth, getCurrentUser);

module.exports = router;
