const BadRequestError = require("../errors/bad-request-err");
const ConflictError = require("../errors/conflict-err");
const ForbiddenError = require("../errors/forbidden-err");
const UnauthorizedError = require("../errors/unauthorized-err");

const OK = 200;
const NO_CONTENT = 204;
const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const INTERNAL_SERVER_ERROR = 500;
const DUPLICATE_ERROR = 409;
const UNAUTHORIZED_ERROR_CODE = 401;
const ACCESS_DENIED_ERROR = 403;

const messageBadRequest = "Bad Request Error";
const messageInternalServerError = "Internal Server Error";
const messageNotFoundError = "Not Found Error";
const messageDuplicateError = "Email Already Exists";
const messageUnauthorizedError = "Authorization Required";
const messageAccessDeniedError = "You do not have permission";

function handleErrors(err, next) {
  if ((err.name = "DocumentNotFoundError")) {
    return next(new NotFoundError("Could not find resource"));
  }
  if ((err.name = "ValidationError" || err.name === "CastError")) {
    return next(new BadRequestError("Invalid request format"));
  }
  if ((err.name = "DuplicateError" || err.code === 11000)) {
    return next(new ConflictError("Email already exists"));
  }
  if ((err.name = "Access Denied")) {
    return next(new UnauthorizedError("Authorization required"));
  }
  if (err.name === "ForbiddenError") {
    return next(new ForbiddenError("Access Denied"));
  } else {
    next(err);
  }
}

module.exports = {
  OK,
  NO_CONTENT,
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  DUPLICATE_ERROR,
  UNAUTHORIZED_ERROR_CODE,
  ACCESS_DENIED_ERROR,
  messageBadRequest,
  messageInternalServerError,
  messageNotFoundError,
  messageDuplicateError,
  messageUnauthorizedError,
  messageAccessDeniedError,
  handleErrors,
};
