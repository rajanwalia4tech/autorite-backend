const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");
const bcrypt = require("bcrypt");
const { User } = require("../db");

const createUser = async (userBody) => {
    let [user] = await User.getUserByEmail(userBody.email);
    if (user) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
    }
    userBody.password = await bcrypt.hash(userBody.password, 10);
    user = await User.create(userBody);
    userBody.id = user.insertId;
    delete userBody.password;
    return userBody;
}

const getUserById = async (id) => {
    const [user] = await User.getUserById(id);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }
    return user;
}

const updateUser = async (userId, updateBody) => {
    try{
        await User.update({user_id : userId,fields:updateBody});
        return ;
    }catch(err){
        throw new ApiError(httpStatus.BAD_REQUEST, "Something went wrong");
    }
}

module.exports = {
    createUser,
    getUserById,
    updateUser
}
