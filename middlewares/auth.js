const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { ERROR_CODES, ERROR_MESSAGES } = require("../utils/errors");

const auth = (req, res, next) => {
  console.log(JWT_SECRET);
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer")) {
    return res
      .status(ERROR_CODES.AUTHORIZATION_ERROR)
      .json({ message: ERROR_MESSAGES.AUTHORIZATION_ERROR });
  }
  const token = authorization.replace("Bearer ", "");
  console.log("Token", token);
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
    console.log("Payload:", payload);
  } catch (err) {
    return res
      .status(ERROR_CODES.AUTHORIZATION_ERROR)
      .send({ message: ERROR_MESSAGES.AUTHORIZATION_ERROR });
  }

  req.user = payload;
  if (req.user && req.user._id) {
    console.log("User ID:", req.user._id);
  } else {
    console.error("Token does not contain user ID");
  }

  return next();
};

module.exports = auth;
