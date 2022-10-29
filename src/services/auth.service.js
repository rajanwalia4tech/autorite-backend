const { User, Token } = require("../db");
const ApiError = require("../utils/ApiError");
const { tokenTypes } = require("../config/tokens");
const httpStatus = require("http-status");
const bcrypt = require("bcrypt");
const { tokenService, userService } = require("./");
const config = require("../config");

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
  if(!user.isEmailVerified){
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please verify your email');
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

const refreshTokens = async(refreshToken)=>{
  try{
    const tokenInfo = await tokenService.verifyToken(refreshToken,tokenTypes.REFRESH,config.jwt.refreshTokenSecret);
    const user = await userService.getUserById(tokenInfo.user_id);
    // blacklist old Token
    await Token.updateToken({token_id:tokenInfo.id,fields:{blacklisted:true}});
    const tokens = await tokenService.generateAuthTokens(user);
    return tokens;
  }catch(err){
    throw new ApiError(httpStatus.UNAUTHORIZED,"Invalid Token");
  }
}

const logout = async(userId,refreshToken)=>{
  try{
    const [tokenInfo] = await Token.findToken({ token:refreshToken, type:tokenTypes.REFRESH, user_id: userId, blacklisted: false });
    if (!tokenInfo) {
      throw new Error();
    }

    // blacklist old Token
    await Token.updateToken({token_id:tokenInfo.id,fields:{ blacklisted: true }});
    return true;
  }catch(err){
    throw new ApiError(httpStatus.UNAUTHORIZED,"Invalid Token");
  }
}

module.exports = {
  loginUserWithEmailAndPassword,
  refreshTokens,
  logout
}