const httpStatus = require("http-status");
const catchAsync = require("../utils/CatchAsync");
const { userService, tokenService, authService, emailService, subscriptionService } = require("../services");
const { Subscription } = require("../db");


const register = catchAsync(async (req, res) => {
    const user = await userService.createUser(req.body);
    const verificationEmailToken = await tokenService.generateVerifyEmailToken(user);
    await emailService.sendVerificationEmail(user.name,user.email, verificationEmailToken);
    res.status(httpStatus.CREATED).send({ message: "You have registered successfully. Please verify your email" });
});

const login = catchAsync(async (req, res) => {
    const { email, password } = req.body;
    const user = await authService.loginUserWithEmailAndPassword(email, password);
    const tokens = await tokenService.generateAuthTokens(user);
    res.send({ user, tokens });
})

const sendVerificationEmail = catchAsync(async (req, res) => {
    const user = {
        id : req.body.user_id,
        email : req.body.email
    }
    const verificationEmailToken = await tokenService.generateVerifyEmailToken(user);
    const userInfo = await userService.getUserById(user.id);
    await emailService.sendVerificationEmail(userInfo.name,user.email, verificationEmailToken);
    return res.status(httpStatus.OK).send({message: "Verification email sent"});
});

const verifyEmail = catchAsync(async (req, res) => {
    const { token } = req.query;
    const userId = await tokenService.verifyEmailToken(token);
    const userInfo = await userService.getUserById(userId);
    const razorpayId = await subscriptionService.createCustomer(userInfo.name,userInfo.email);
    await userService.updateUser(userId, {isEmailVerified : true,razorpay_id : razorpayId});
    subscriptionService.addUserOnTrialPlan(userId);
    res.status(httpStatus.OK).send({message: "Email verified successfully"});
});

const refreshTokens = catchAsync(async (req,res)=>{
    const tokens = await authService.refreshTokens(req.body.refreshToken);
    return res.status(httpStatus.OK).send({...tokens});
})

const logout = catchAsync(async (req,res)=>{
    await authService.logout(req.body.user_id,req.body.refreshToken);
    return res.status(httpStatus.OK).send({ message: "Logged out successfully" });
})

module.exports = {
    register,
    login,
    sendVerificationEmail,
    verifyEmail,
    refreshTokens,
    logout
}