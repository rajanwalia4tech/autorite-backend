const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");
const User = require("../db/user.db");

const createUser = async (userBody) => {
    if(await User.getUserByEmail(userBody.email)){
        throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
    }
    const user = await User.create(userBody);
    return user;
}


module.exports = { 
    createUser
}
