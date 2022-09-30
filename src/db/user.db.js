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


module.exports = {
    create,
    getUserByEmail,
    getUserById
}