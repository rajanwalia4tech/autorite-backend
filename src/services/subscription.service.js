const Razorpay = require('razorpay');
const config = require("../config");
const httpStatus = require("http-status");
const ApiError = require('../utils/ApiError');
var instance = new Razorpay({
  key_id: config.apiKeys.razorpayKeyId,
  key_secret: config.apiKeys.razorpayKeySecret,
});

class Subscription{
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
}

module.exports = new Subscription();