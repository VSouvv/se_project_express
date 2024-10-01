const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const {
  OK,
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  DUPLICATE_ERROR,
  UNAUTHORIZED_ERROR_CODE,
  messageBadRequest,
  messageInternalServerError,
  messageNotFoundError,
  messageDuplicateError,
  messageUnauthorizedError,
} = require("../utils/errors");

// create user
const createUser = (req, res) => {
  console.log(req);
  console.log(req.body);

  let { name, avatar, email, password } = req.body;
  const userInfo = { name, email };
  if (avatar) {
    userInfo.avatar = avatar;
  }

  if (!email || !password) {
    res
      .status(BAD_REQUEST)
      .send({ message: `${messageBadRequest} from createUser` });
    return;
  }

  User.findOne({ email })
    .select("+password")
    .then((existingEmail) => {
      if (existingEmail) {
        const error = new Error();
        error.name = "DuplicateError";
        throw error;
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => {
      userInfo.password = hash;
      return User.create(userInfo);
    })
    .then((user) => {
      console.log(user);
      res.status(201).send({
        name: user.name,
        avatar: user.avatar,
        email: user.email,
      });
    })

    .catch((err) => {
      if (err.name === "ValidationError") {
        console.error(err);
        return res
          .status(BAD_REQUEST)
          .send({ message: `${messageBadRequest} createUser` });
      }
      if (err.name === "DuplicateError" || err.code === 11000) {
        return res
          .status(DUPLICATE_ERROR)
          .send({ message: `${messageDuplicateError} from createUser` });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: `${messageInternalServerError} from createUser` });
    });
};
// getUsers
const getUsers = (req, res) => {
  User.findById(req.user._id)
    .then((user) => res.status(OK).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: `${messageBadRequest} from getUsers` });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: `${messageInternalServerError} from getUsers` });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(BAD_REQUEST)
      .send({ message: `${messageBadRequest} from login` });
  }
  return User.findOne({ email })

    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      res.send({ token, user });
    })

    .catch((err) => {
      console.error(err);
      res
        .status(UNAUTHORIZED_ERROR_CODE)
        .send({ message: `${messageUnauthorizedError}` });
    });
};

const updateUser = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name, avatar: req.body.avatar },

    {
      new: true,
      runValidators: true,
    }
  )
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        console.error(err);
        return res
          .status(BAD_REQUEST)
          .send({ message: `${messageBadRequest} updateUser` });
      }
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND)
          .send({ message: `${messageNotFoundError} from updateUser` });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: `${messageInternalServerError} from updateUser` });
    });
};

module.exports = {
  createUser,
  getUsers,
  login,
  updateUser,
};
