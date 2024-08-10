const router = require("express").Router();

router.get("/", getUsers);
router.get("/:userId", getUser);
router.post("/", createUser);

module.exports = router;
