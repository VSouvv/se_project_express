const router = require("express").Router();
const auth = require("../middlewares/auth");

const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

const {
  validateClothingItem,
  validateId,
} = require("../middlewares/validation");

// CRUD

// Read
router.get("/", getItems);

router.use(auth);

// Create
router.post("/", validateClothingItem, createItem);

// Delete

router.delete("/:itemId", validateId, deleteItem);

// Like Item (Put)
router.put("/:itemId/likes", validateId, likeItem);

// Dislike Item(Delete)
router.delete("/:itemId/likes", validateId, dislikeItem);

module.exports = router;
