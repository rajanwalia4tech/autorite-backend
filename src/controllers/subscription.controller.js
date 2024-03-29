const httpStatus = require("http-status");
const catchAsync = require("../utils/CatchAsync");
const {subscriptionService} =require("../services");
const ApiError = require("../utils/ApiError");
const config = require("../config");
const fs = require("fs");
const { isGeneratorFunction } = require("util/types");


const webhook = catchAsync(async (req, res) => {
    await subscriptionService.handleWebhook(req);
    return res.status(httpStatus.OK).send({message :"success"});
});

const getAllPlans = catchAsync(async (req, res) => {
    const request = {...req.query};
    const userPlanInfo = await subscriptionService.getUserPlanInfo(request.user_id);
    const plans = await subscriptionService.getAllPlans();
    return res.status(httpStatus.OK).send({userPlanInfo,plans});
});

const createSubscription = catchAsync(async (req, res) => {
    const request = {...req.body};
    if(request.plan_id == 1)
        throw new ApiError(httpStatus.BAD_REQUEST, "This is a trial plan!");
    const planInfo = await subscriptionService.getPlanById(request.plan_id);
    const subscriptionInfo = await subscriptionService.createSubscription(request,planInfo);
    return res.status(httpStatus.OK).send({subscriptionInfo,message:"Subscription Session Created"});
});

const getSessionById = catchAsync(async (req, res) => {
    const request = {...req.query};
    const sessionId = req.params.sessionId;
    const subscriptionInfo  = await subscriptionService.getSessionById(sessionId,request.user_id);
    return res.status(httpStatus.OK).send({subscriptionInfo,message:"Subscription Session Created"});
});

module.exports = {
    webhook,
    getAllPlans,
    createSubscription,
    getSessionById
}