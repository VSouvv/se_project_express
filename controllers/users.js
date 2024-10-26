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

const NotFoundError = require("../errors/not-found-err");
const UnauthorizedError = require("../errors/unauthorized-err");
const ForbiddenError = require("../errors/forbidden-err");
const ConflictError = require("../errors/conflict-err");
const BadRequestError = require("../errors/bad-request-err");
// create user
const createUser = (req, res, next) => {
  console.log(req);
  console.log(req.body);

  let { name, avatar, email, password } = req.body;
  const userInfo = { name, email };
  if (avatar) {
    userInfo.avatar = avatar;
  }

  // hash password
  // bcrypt.hash(req.body.password, 10)

  // throw a 110{{00 error for duplicate error using throw block

  if (!email || !password) {
    throw new BadRequestError("Invalid email and password");
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
      handleErrors(err, next);
    });
};
// getUsers
const getUsers = (req, res) => {
  User.findById(req.user._id)
    .then((user) => res.status(OK).send(user))
    .catch((err) => {
      handleErrors(err, next);
    });
};

const login = (req, res) => {
  const { email, password } = req.body;
  // get email and password from the request body
  if (!email || !password) {
    // return res
    //   .status(BAD_REQUEST)
    //   .send({ message: `${messageBadRequest} from login` });
    throw new BadRequestError("missing email or password");
  }
  return (
    User.findOne({ email })
      // if email and password are correct,
      .then((user) => {
        // res.status(OK).send(user);
        // //creates JWT
        const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
          expiresIn: "7d",
        });
        // send token to client
        res.send({ token, user });
      })
      // if email and password are incorrect, return 401 error
      .catch((err) => {
        handleErrors(err, next);
      })
  );
};

const updateUser = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name, avatar: req.body.avatar },
    // pass the options object:
    {
      new: true, // the then handler receives the updated entry as input
      runValidators: true, // the data will be validated before the update
    }
  )
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      handleErrors(err, next);
    });
};

module.exports = {
  createUser,
  getUsers,
  login,
  updateUser,
};
