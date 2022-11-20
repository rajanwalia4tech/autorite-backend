const Razorpay = require('razorpay');
const config = require("../config");
const httpStatus = require("http-status");
const ApiError = require('../utils/ApiError');
const {Subscription} = require("../db");
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
        try{
            const plans = await Subscription.getAllPlans();
            return plans;
        }catch(err){
            throw new ApiError(httpStatus.BAD_REQUEST, "Something went wrong while fetching plans")
        }
    }
    async getPlanById(planId){
        try{
            const [plan] = await Subscription.getPlanById(planId);
            if(!plan) throw new ApiError(httpStatus.NOT_FOUND, "Plan not found")
            return plan;
        }catch(err){
            if(err.statusCode == httpStatus.NOT_FOUND) throw new ApiError(httpStatus.NOT_FOUND,  "There is no plan with id "+planId)
            throw new ApiError(httpStatus.BAD_REQUEST, "Something went wrong while fetching plan")
        }
    }
    async createSubscription(request,planInfo){
        try{
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
                status : subscriptionInfo.status,
                short_url:subscriptionInfo.short_url,
            };
            await Subscription.saveSession(subscriptionSessionPayload);
            return subscriptionSessionPayload;
        }catch(err){
            throw new ApiError(httpStatus.BAD_REQUEST, "Something went wrong while creating subscription")
        }
    }
}

module.exports = new SubscriptionService();