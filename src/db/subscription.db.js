const {dbHandler} = require("./db");

function getAllPlans(){
    let query = `select plan_id,plan_name,plan_type,plan_category,price,currency, wallet_credits,validity,created_at, updated_at from subscription_plans WHERE is_active=1`;
    let queryObj = {
        query: query,
        args: [],
        event: "getAllPlans",
    };
    return dbHandler.executeQuery(queryObj);
}

function getPlanById(planId){
    let query = `select plan_id,product_id,plan_name,plan_type,plan_category,price,currency, wallet_credits,validity from subscription_plans WHERE plan_id = ? and is_active=1`;
    let queryObj = {
        query: query,
        args: [planId],
        event: "getPlanById",
    };
    return dbHandler.executeQuery(queryObj);
}

function saveSession(payload){
    let query = "INSERT INTO subscription_session SET ?;"
    let queryObj = {
        query: query,
        args: [payload],
        event: "update article",
    };
    return dbHandler.executeQuery(queryObj);
}

function createUserSubscription(payload){
    let query = "INSERT INTO user_subscription SET ?;"
    let queryObj = {
        query: query,
        args: [payload],
        event: "update article",
    };
    return dbHandler.executeQuery(queryObj);
}


module.exports = {
    getAllPlans,
    getPlanById,
    saveSession,
    createUserSubscription
}