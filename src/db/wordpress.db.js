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
        const query = `SELECT * FROM user_wordpress_info WHERE user_id = ?;`;
        let queryObj = {
            query,
            args: [userId],
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

module.exports = {
    create,
    findByUserId
}