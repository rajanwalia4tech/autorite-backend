const {dbHandler} = require("./db");

const create = (payload)=>{
    return new Promise(async(resolve,reject)=>{
        const query = `INSERT INTO users SET ?`;
        let queryObj = {
            query,
            values: payload,
            event : "create user"
        }
        dbHandler.executeQuery(queryObj)
        .then((result)=>{
            resolve(result);
        }).catch((err)=>{
            reject(err);
        });
    });
}

const getUserByEmail = (payload)=>{
    return new Promise(async(resolve,reject)=>{
    const query = `SELECT * FROM users WHERE email = ?`;
        let queryObj = {
            query,
            values: [payload.email],
            event : "getUserByEmail"
        }
        dbHandler.executeQuery(queryObj)
        .then((result)=>{
            resolve(result);
        }).catch((err)=>{
            reject(err);
        });
    });
}

module.exports = {
    create,
    getUserByEmail
}