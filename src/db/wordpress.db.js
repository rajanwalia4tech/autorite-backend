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

const update = (payload)=>{
    if (!Object.keys(payload.fields).length)
        return Promise.reject("fields cannot be empty");
    return new Promise((resolve, reject) => {
        let query = `UPDATE user_wordpress_info SET `;
        let { fields } = payload;
        query = Object.keys(fields).reduce(
            (acc, curr) => acc + ` ${curr} ` + " = ?,",
            query
        );
  
        query = query.slice(0, -1) + ` WHERE id = ? `;
        console.log(query);
        let queryObj = {
            query: query,
            args: [...Object.values(payload.fields), payload.id],
            event: "update Wordpress Info",
        };
        dbHandler.executeQuery(queryObj).then(
            (result) => {
                resolve(result);
            },
            (error) => {
                reject(error);
            }
        );
    });
  }
  const isValidUser = (userId, wordpressId)=>{
        const query = `SELECT * FROM user_wordpress_info WHERE id=? AND user_id = ? AND is_connected=1 ORDER BY updated_at DESC LIMIT 1;`;
        let queryObj = {
            query,
            args: [wordpressId,userId],
            event: "isValidUser"
        }
        return dbHandler.executeQuery(queryObj);
}

module.exports = {
    create,
    findByUserId,
    findByDomain,
    update,
    isValidUser
}