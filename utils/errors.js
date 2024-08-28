const ERROR_CODES = {
  BAD_REQUEST: 400,
  AUTHORIZATION_ERROR: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  DUPLICATE_EMAIL_EXISTS: 409,
  SERVER_ERROR: 500,
};

const ERROR_MESSAGES = {
  BAD_REQUEST:
    " invalid data passed to the methods for creating an item/user or updating an item",
  AUTHORIZATION_ERROR:
    " there is something wrong with authorization; i.e., an incorrect email or password, the token is invalid, or an unauthorized user is trying to access protected routes.",
  FORBIDDEN:
    "This is a permissions issue. The user is trying to remove the card of another user.",
  NOT_FOUND:
    "There is no user or clothing item with the requested id or the request was sent to a non-existent address.",
  DUPLICATE_EMAIL_EXISTS:
    "When registering, the user entered an email address that already exists on the server.",
  SERVER_ERROR:
    "Default error. Accompanied by the message: “An error has occurred on the server.",
};

module.exports = {
  ERROR_CODES,
  ERROR_MESSAGES,
};
