const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "An error occurred on the server";
  console.err(err);
  res.status(statusCode).send({ message });
};

module.exports = errorHandler;
cc;
