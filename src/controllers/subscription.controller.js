const httpStatus = require("http-status");
const catchAsync = require("../utils/CatchAsync");
const {subscriptionService} =require("../services");



const webhook = catchAsync(async (req, res) => {
    const request = {...req.body};
    console.log(request);
    return res.status(httpStatus.OK).send({status: "DONE"});
});


module.exports = {
    webhook
}