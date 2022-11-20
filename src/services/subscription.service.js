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
}

module.exports = new SubscriptionService();