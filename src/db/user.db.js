const { dbHandler } = require("./db");

const create = (payload) => {
    return new Promise(async (resolve, reject) => {
        const query = `INSERT INTO users SET ?;`;
        let queryObj = {
            query,
            args: [payload],
            event: "create user"
        }
        dbHandler.executeQuery(queryObj)
            .then((result) => {
                resolve(result);
            }).catch((err) => {
                reject(err);
            });
    });
}

const getUserByEmail = (email) => {
    return new Promise(async (resolve, reject) => {
        const query = `SELECT * FROM users WHERE email=?`;
        let queryObj = {
            query,
            args: [email],
            event: "getUserByEmail"
        }
        dbHandler.executeQuery(queryObj)
            .then((result) => {
                resolve(result);
            }).catch((err) => {
                reject(err);
            });
    });
}

const getUserById = (id) => {
    return new Promise(async (resolve, reject) => {
        const query = `SELECT * FROM users WHERE id=?`;
        let queryObj = {
            query,
            args: [id],
            event: "getUserByEmail"
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
        let query = `UPDATE users SET `;
        let { fields } = payload;
        query = Object.keys(fields).reduce(
            (acc, curr) => acc + ` ${curr} ` + " = ?,",
            query
        );
  
        query = query.slice(0, -1) + ` WHERE id = ? `;
        console.log(query);
        let queryObj = {
            query: query,
            args: [...Object.values(payload.fields), payload.user_id],
            event: "update Users",
        };
        return dbHandler.executeQuery(queryObj);
}

module.exports = {
    create,
    getUserByEmail,
    getUserById,
    update
}