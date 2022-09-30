const { User } = require("../db");
const ApiError = require("../utils/ApiError");
const { tokenTypes } = require("../config/tokens");
const httpStatus = require("http-status");
const bcrypt = require("bcrypt");

const isPasswordMatch = async (user, password) => {
  return await bcrypt.compare(password, user.password);
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
  delete user.password;
  return user;
};

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise}
 */
 const verifyEmail = async (verifyEmailToken) => {
  try {
    const verifyEmailTokenDoc = await tokenService.verifyToken(verifyEmailToken, tokenTypes.VERIFY_EMAIL);
    const user = await userService.getUserById(verifyEmailTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await Token.deleteMany({ user: user.id, type: tokenTypes.VERIFY_EMAIL });
    await userService.updateUserById(user.id, { isEmailVerified: true });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed');
  }
};

module.exports = {
  loginUserWithEmailAndPassword
}