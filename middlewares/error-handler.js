const errorHandler = (err, req, res, next) => {
  console.error(err);
  const { statusCode = 500, message = "An error occurred on the server" } = err;
  res.status(statusCode).send({
    message,
  });
  next();
};

module.exports = errorHandler;
