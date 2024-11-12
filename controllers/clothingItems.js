const ClothingItem = require("../models/clothingItem");
const { OK, handleErrors } = require("../utils/errors");

const ForbiddenError = require("../errors/forbidden-err");

const createItem = (req, res, next) => {
  console.log(req);

  console.log(req.body);

  const { name, weather, imageUrl } = req.body;
  const { _id } = req.user;

  ClothingItem.create({ name, weather, imageUrl, owner: _id })
    .then((item) => {
      console.log(item);
      res.send({ data: item });
    })
    .catch((err) => {
      handleErrors(err, next);
    });
};

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.status(OK).send(items))
    .catch((err) => {
      handleErrors(err, next);
    });
};

const updateItem = (req, res, next) => {
  const { itemId } = req.params;
  const { imageUrl } = req.body;

  ClothingItem.findByIdAndUpdate(itemId, { $set: { imageUrl } })
    .orFail()
    .then((item) => res.status(OK).send({ data: item }))
    .catch((err) => {
      handleErrors(err, next);
    });
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (item.owner.toString() !== userId) {
        throw new ForbiddenError("Current user does not own item");
      }
      return ClothingItem.findByIdAndDelete(itemId);
    })
    .then((item) => res.status(OK).send(item))
    .catch((err) => {
      handleErrors(err, next);
    });
};

const likeItem = (req, res, next) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(OK).send(item))
    .catch((err) => {
      handleErrors(err, next);
    });

const dislikeItem = (req, res, next) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(OK).send(item))
    .catch((err) => {
      handleErrors(err, next);
    });

module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  dislikeItem,
  ClothingItem,
};
