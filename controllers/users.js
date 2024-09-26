const jwt = require("jsonwebtoken");
const validator = require("validator");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { ERROR_CODES, ERROR_MESSAGES } = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const createUser = async (req, res) => {
  const { name, avatar, email, password } = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !password) {
    return res
      .status(ERROR_CODES.BAD_REQUEST)
      .send({ message: ERROR_MESSAGES.BAD_REQUEST });
  }

  if (!emailRegex.test(email)) {
    return res
      .status(ERROR_CODES.BAD_REQUEST)
      .send({ message: "Invalid email format" });
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(ERROR_CODES.DUPLICATE_EMAIL_EXISTS)
        .send({ message: ERROR_MESSAGES.DUPLICATE_EMAIL_EXISTS });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      avatar,
      email,
      password: hashPassword,
    });
    console.log(newUser);
    return res.status(201).send({ name, avatar, email });
  } catch (err) {
    console.error(err);
    if (err.name === "ValidationError") {
      return res
        .status(ERROR_CODES.BAD_REQUEST)
        .send({ message: ERROR_MESSAGES.BAD_REQUEST });
    }

    return res
      .status(ERROR_CODES.SERVER_ERROR)
      .send({ message: ERROR_MESSAGES.SERVER_ERROR });
  }
};

const getCurrentUser = (req, res) => {
  const userId = req.user._id;
  User.findById(userId)
    .select("-password")
    .orFail()
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res
          .status(ERROR_CODES.BAD_REQUEST)
          .send({ message: ERROR_MESSAGES.BAD_REQUEST });
      }
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(ERROR_CODES.NOT_FOUND)
          .send({ message: ERROR_MESSAGES.NOT_FOUND });
      }
      return res
        .status(ERROR_CODES.SERVER_ERROR)
        .send({ message: ERROR_MESSAGES.SERVER_ERROR });
    });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(ERROR_CODES.BAD_REQUEST)
      .send({ message: ERROR_MESSAGES.BAD_REQUEST });
  }

  if (!validator.isEmail(email)) {
    return res
      .status(ERROR_CODES.BAD_REQUEST)
      .send({ message: "Invalid email format" });
  }

  try {
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });
    console.log(user);
    console.log(token);
    return res.status(200).send({ token });
  } catch (err) {
    console.log(err);
    if (err.message === "Incorrect email or password") {
      return res
        .status(ERROR_CODES.AUTHORIZATION_ERROR)
        .send({ message: ERROR_MESSAGES.AUTHORIZATION_ERROR });
    }
    return res
      .status(ERROR_CODES.SERVER_ERROR)
      .send({ message: ERROR_MESSAGES.SERVER_ERROR });
  }
};

const updateUser = (req, res) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;
  console.log(userId);

  const updates = {};
  if (name) updates.name = name;
  if (avatar) updates.avatar = avatar;

  User.findByIdAndUpdate(userId, updates, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(ERROR_CODES.NOT_FOUND).json({
          status: "error",
          message: ERROR_MESSAGES.NOT_FOUND,
        });
      }
      return res.status(200).json({
        data: user,
      });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(ERROR_CODES.BAD_REQUEST).json({
          status: "error",
          message: "Validation Error",
          errors: err.errors,
        });
      }
      return res.status(ERROR_CODES.SERVER_ERROR).json({
        status: "error",
        message: ERROR_MESSAGES.SERVER_ERROR,
      });
    });
};

module.exports = { createUser, login, getCurrentUser, updateUser };
