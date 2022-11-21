const Razorpay = require('razorpay');
const moment = require("moment");
const config = require("../config");
const httpStatus = require("http-status");
const ApiError = require('../utils/ApiError');
const {Subscription} = require("../db");
const {SUBSCRIPTION} = require("../utils/constants");
var instance = new Razorpay({
  key_id: config.apiKeys.razorpayKeyId,
  key_secret: config.apiKeys.razorpayKeySecret,
});

class SubscriptionService{
    async createCustomer(name,email,contact=""){
        try{
        const result = await instance.customers.create({name,email,contact});
        console.log(result);
        return result.id;
        }catch(err){
            if(err.statusCode == httpStatus.BAD_REQUEST) // remove the throw errors 
                throw new ApiError(httpStatus.BAD_REQUEST,"Customer already exists for the merchant")

            throw new ApiError(httpStatus.BAD_REQUEST, "Something went wrong while creating merchant")
        }
    }
    async getAllPlans(){
        const plans = await Subscription.getAllPlans();
        return plans;
    }
    async getPlanById(planId){
        const [plan] = await Subscription.getPlanById({plan_id :planId});
        if(!plan) throw new ApiError(httpStatus.NOT_FOUND, "Plan not found")
        return plan;
    }
    async createSubscription(request,planInfo){
        let options = {
            "plan_id":planInfo.product_id,
            "total_count":1,
            "quantity":1,
            "customer_notify":1
        }
        const subscriptionInfo = await instance.subscriptions.create(options);
        const subscriptionSessionPayload = {
            user_id : request.user_id,
            subscription_id:subscriptionInfo.id,
            plan_id: planInfo.plan_id,
            product_id : subscriptionInfo.plan_id,
            status : SUBSCRIPTION.SESSION.CREATED,
            short_url:subscriptionInfo.short_url,
        };
        await Subscription.saveSession(subscriptionSessionPayload);
        return subscriptionSessionPayload;
    }

    async addUserOnTrialPlan(userId){
        const [planInfo] = await Subscription.getPlanById({plan_id: SUBSCRIPTION.PLAN_TYPE.TRIAL.PLAN_ID});
        if(!planInfo) throw new ApiError(httpStatus.BAD_REQUEST, "Invalid Plan");
        await this.addUserOnPlan(userId,planInfo)
        return {message : `Successfully added user on ${planInfo.name} plan!`};
    }

    async addUserOnPlan(userId,planInfo){
        let currentDate = moment();
        let expirationAt = new Date(currentDate.add(planInfo.validity, 'days'));
        await Subscription.createUserSubscription({
            user_id : userId,
            plan_id : planInfo.plan_id,
            credits : planInfo.wallet_credits,
            status : SUBSCRIPTION.STATUS.ENABLE,
            subscription_at : new Date(),
            expiration_at : expirationAt
        });
        return true;
    }
    
    async updateUserSubscription(user_id,plan_id){
        const [planInfo] = await Subscription.getPlanById({plan_id : plan_id});
        if(!planInfo) throw new ApiError(httpStatus.BAD_REQUEST, "Invalid Plan");

        // Expire the previous plan
        await Subscription.updateUserSubscription({user_id,fields:{
            status : SUBSCRIPTION.STATUS.DISABLE
        }});

        // Add the user on new Plan
        await this.addUserOnPlan(user_id,planInfo);
        return {message : `Successfully added user on ${planInfo.name} plan!`};
    }

    async handleWebhook(req,res){
        const webhookSecret = config.apiKeys.razorpayWebhookSecret;
        const crypto = require('crypto')
        const shasum = crypto.createHmac('sha256', webhookSecret)
        shasum.update(JSON.stringify(req.body))
        const digest = shasum.digest('hex')
        console.log(digest, req.headers['x-razorpay-signature'])
    
        if (digest === req.headers['x-razorpay-signature']) {
            console.log('request is legit')
            const request = {...req.body};
            if(request.event === "payment.captured"){ // store in transaction table
                return res.status(httpStatus.OK).send({status: "DONE"});
            }else if(request.event == "subscription.completed"){
                const plan_id = request?.payload?.subscription?.entity?.plan_id;
                const subscription_id = request?.payload?.subscription?.entity?.id;
                
                // if(subscription_id)
                const [userSubscriptionSession] = await Subscription.getUserSubscriptionSession({status:SUBSCRIPTION.SESSION.CREATED, subscription_id});
                if(userSubscriptionSession?.user_id && plan_id){
                    await this.updateUserSubscription(userSubscriptionSession?.user_id,userSubscriptionSession.plan_id);
                    await Subscription.updateUserSubscriptionSession({id:userSubscriptionSession.id,fields:{
                        status : SUBSCRIPTION.SESSION.COMPLETED
                    }});
                }
                return res.status(httpStatus.OK).send({status: "DONE"});
            }else if(request.event === "payment.failed"){ // update transaction table
                
                return res.status(httpStatus.OK).send({status: "DONE"});
            }
            // process it
            return res.status(httpStatus.OK).send({status: "DONE"});
        } else {
            // pass it
            throw new ApiError(httpStatus.BAD_REQUEST, "You are not authorized!");
        }
    }
}
// new SubscriptionService().updateUserSubscription("plan_Khq7o8h2zPac4b")
module.exports = new SubscriptionService();