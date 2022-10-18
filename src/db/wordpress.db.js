const {dbHandler} = require("./db");


const create = (payload)=>{
    return new Promise(async (resolve, reject) => {
        const query = `INSERT INTO user_wordpress_info SET ?;`;
        let queryObj = {
            query,
            args: [payload],
            event: "save user wordpress info"
        }
        dbHandler.executeQuery(queryObj)
            .then((result) => {
                resolve(result);
            }).catch((err) => {
                reject(err);
            });
    });
}


const findByUserId = (userId)=>{
    return new Promise(async (resolve, reject) => {
        const query = `SELECT * FROM user_wordpress_info WHERE user_id = ? AND is_connected=1 ORDER BY updated_at DESC LIMIT 1;`;
        let queryObj = {
            query,
            args: [userId],
            event: "find user wordpress info"
        }
        dbHandler.executeQuery(queryObj)
            .then((result) => {
                resolve(result);
            }).catch((err) => {
                reject(err);
            });
    });
}

const findByDomain = (domain)=>{
    return new Promise(async (resolve, reject) => {
        const query = `SELECT * FROM user_wordpress_info WHERE domain = ? AND is_connected=1 ORDER BY updated_at DESC;`;
        let queryObj = {
            query,
            args: [domain],
            event: "findByDomain"
        }
        dbHandler.executeQuery(queryObj)
            .then((result) => {
                resolve(result);
            }).catch((err) => {
                reject(err);
            });
    });
}

module.exports = {
    create,
    findByUserId,
    findByDomain
}