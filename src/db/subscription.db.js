const {dbHandler} = require("./db");

function getAllPlans(){
    let query = `select plan_id,plan_name,plan_type,plan_category,price,currency, wallet_credits,validity,created_at, updated_at from subscription_plans;`;
    let queryObj = {
        query: query,
        args: [],
        event: "update article",
    };
    return dbHandler.executeQuery(queryObj);
}

module.exports = {
    getAllPlans
}