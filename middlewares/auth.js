const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { unauthorizedError } = require("../utils/errors");

const authorizationError = (res) => {
  res.status(unauthorizedError).send({ message: "Authorization Required" });
};

const handleAuthorization = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return authorizationError(res);
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return authorizationError(res);
  }

  req.user = payload;

  return next();
};

module.exports = { handleAuthorization };
