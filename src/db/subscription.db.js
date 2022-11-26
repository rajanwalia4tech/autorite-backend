const {SUBSCRIPTION} = require("../utils/constants");
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

function getPlanById(payload){
    let query = `select plan_id,product_id,plan_name,plan_type,plan_category,price,currency, wallet_credits,validity from subscription_plans WHERE is_active=1 `;
    // let query = dbHandler.generateSelectQuery({table: "subscription_plans", fields : ["plan_id","product_id","plan_name","plan_type","plan_category","price","currency","wallet_credits","validity"], {plan_id:planId, is_active:1}});
    if(payload.plan_id) query += ` AND plan_id = ${payload.plan_id}`;
    if(payload.product_id) query += ` AND product_id = ${payload.product_id}`;
    let queryObj = {
        query: query,
        args: [],
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

const updateUserSubscription = (payload)=>{
    if (!Object.keys(payload.fields).length)
        throw new Error ("fields cannot be empty");
    let query = `UPDATE user_subscription SET `;
    let { fields } = payload;
    query = Object.keys(fields).reduce(
        (acc, curr) => acc + ` ${curr} ` + " = ?,",
        query
    );

    query = query.slice(0, -1) + ` WHERE user_id = ? `;
    let queryObj = {
        query: query,
        args: [...Object.values(payload.fields), payload.user_id],
        event: "update article",
    };
    return dbHandler.executeQuery(queryObj);
}

const getUserSubscriptionSession = (payload)=>{ 
    let query ;
    if(payload.id)
    query = `SELECT id session_id, user_id, plan_id,status, subscription_id FROM subscription_session WHERE id = ${payload.id} `;
    
    if(payload.status)
        query = `SELECT * FROM subscription_session WHERE status=${payload.status} `;
    if(payload.subscription_id) query += ` AND subscription_id="${payload.subscription_id}"`;

    if(payload.user_id) query += ` AND user_id=${payload.user_id}`;
    console.log(query)
    let queryObj = {
        query: query,
        args: [],
        event: "getUserSubscriptionSession",
    };
    return dbHandler.executeQuery(queryObj);
}

const updateUserSubscriptionSession = (payload)=>{
    if (!Object.keys(payload.fields).length)
        throw new Error ("fields cannot be empty");
    let query = `UPDATE subscription_session SET `;
    let { fields } = payload;
    query = Object.keys(fields).reduce(
        (acc, curr) => acc + ` ${curr} ` + " = ?,",
        query
    );

    query = query.slice(0, -1) + ` WHERE id = ? `;
    let queryObj = {
        query: query,
        args: [...Object.values(payload.fields), payload.id],
        event: "update article",
    };
    return dbHandler.executeQuery(queryObj);
}
module.exports = {
    getAllPlans,
    getPlanById,
    saveSession,
    createUserSubscription,
    updateUserSubscription,
    getUserSubscriptionSession,
    updateUserSubscriptionSession
}