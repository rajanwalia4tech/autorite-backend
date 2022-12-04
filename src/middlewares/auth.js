const httpStatus = require("http-status");
const jwt = require("jsonwebtoken");
const config = require("../config");
const ApiError = require("../utils/ApiError");

function user(req, res, next) {
  const token = req.header("Authorization");
  if (!token)
    throw new ApiError(httpStatus.UNAUTHORIZED, "Access denied. No token provided.");
  try {
    const decoded = jwt.verify(token, config.jwt.accessTokenSecret);
    req.user = decoded;
    if (req.method === "GET") {
      body = Object.assign({}, req.query, decoded);
      req.query = body;
    } else {
      body = Object.assign({}, req.body, decoded);
      req.body = body;
    }
    return next();
  } catch (ex) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Access denied. No token provided."); // invalid token
  }
}

module.exports = {
  user
};