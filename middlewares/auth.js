const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const {
  UNAUTHORIZED_ERROR_CODE,
  messageUnauthorizedError,
} = require("../utils/errors");

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(UNAUTHORIZED_ERROR_CODE)
      .send({ message: `${messageUnauthorizedError} from auth` });
  }

  // gets token
  const token = authorization.replace("Bearer ", "");
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.error(err);
    return res
      .status(UNAUTHORIZED_ERROR_CODE)
      .send({ message: `${messageUnauthorizedError} from auth` });
  }

  req.user = payload;

  return next();
};

module.exports = auth;
