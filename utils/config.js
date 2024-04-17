// const JWT_SECRET = "SecretKey123";

// module.exports = { JWT_SECRET };

// const { NODE_ENV, JWT_SECRET } = process.env;

// const token = jwt.sign(
//   { _id: user._id },
//   NODE_ENV === "production" ? JWT_SECRET : "dev-secret",
// );

const { NODE_ENV, JWT_SECRET = "dev-secret" } = process.env;
module.exports = { JWT_SECRET, NODE_ENV };
