const httpStatus = require("http-status");
const catchAsync = require("../utils/CatchAsync");
const { userService, tokenService, authService, emailService } = require("../services");


const register = catchAsync(async (req, res) => {
    const user = await userService.createUser(req.body);
    const tokens = await tokenService.generateAuthTokens(user);
    res.status(httpStatus.CREATED).send({ user, tokens });
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
        email: "rajanwalia334@gmail.com" || req.body.email
    }
    const verificationEmailToken = await tokenService.generateVerifyEmailToken(user);
    const userInfo = await userService.getUserById(user.id);
    await emailService.sendVerificationEmail(userInfo.name,user.email, verificationEmailToken);
    return res.status(httpStatus.OK).send({message: "Verification email sent"});
});

const verifyEmail = catchAsync(async (req, res) => {
    const { token } = req.query;
    const user = await tokenService.verifyEmailToken(token);
    await userService.verifyEmail(user.id);
    res.status(httpStatus.OK).send({message: "Email verified successfully"});
});

module.exports = {
    register,
    login,
    sendVerificationEmail,
    verifyEmail
}