const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const {
  UNAUTHORIZED_ERROR_CODE,
  messageUnauthorizedError,
  handleErrors,
} = require("../utils/errors");

const UnauthorizedError = require("../errors/unauthorized-err");
const HandleErrors = require("../utils/errors");

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new UnauthorizedError("Authorization required!");
  }

  const token = authorization.replace("Bearer ", "");
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    handleErrors(err, next);
  }

  req.user = payload;

  return next();
};

module.exports = auth;
