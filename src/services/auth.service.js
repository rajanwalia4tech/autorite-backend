const { User } = require("../db");
const ApiError = require("../utils/ApiError");
const { tokenTypes } = require("../config/tokens");
const httpStatus = require("http-status");
const bcrypt = require("bcrypt");

const isPasswordMatch = async (user, password) => {
  return await bcrypt.compare(user.password, password);
}

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
  const [user] = await User.getUserByEmail(email);
  if (!user || !(await isPasswordMatch(user, password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  return user;
};

module.exports = {
  loginUserWithEmailAndPassword
}