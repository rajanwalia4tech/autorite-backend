const httpStatus = require("http-status");
const catchAsync = require("../utils/CatchAsync");
const { userService, wordpressService } = require("../services");
const ApiError = require("../utils/ApiError");
const { WORDPRESS } = require("../utils/constants");

const connect = catchAsync(async (req, res) => {
    const {username, domain ,password,user_id} = req.body;
    // throw new ApiError(httpStatus.BAD_REQUEST ,"test")
    // test if they are valid or not
    await wordpressService.isDomainAlreadyConnected(domain);
    
    await wordpressService.verifyWordpressCredentials(username,password,domain);

    // then store them in DB
    await wordpressService.saveUserWordpressInfo({user_id ,username, domain, password,is_connected:true});
    res.status(httpStatus.CREATED).send({ 
        message: WORDPRESS.SUCCESS.CONNECTED
    });
});

const getWordpressInfo = catchAsync(async (req, res) => {
    console.log("getWordpressInfo")
    const userWordpressInfo = await wordpressService.getUserWordpressInfo(req.query.user_id);
    let credentials = {
        username: userWordpressInfo.username,
        domain: userWordpressInfo.domain,
        password: userWordpressInfo.password
    }
    const response =  await wordpressService.getWordPressDetails(credentials);
    response.w_id = userWordpressInfo.id;
    response.username = userWordpressInfo.username;
    response.domain =  userWordpressInfo.domain;
    return res.status(httpStatus.OK).send(response)
})

module.exports = {
    connect,
    getWordpressInfo
}
