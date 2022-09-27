const {dbHandler} = require("./db");

const findAll = (payload) => {
    return new Promise(async (resolve, reject) => {
        const query = `SELECT * FROM generate_usecases;`;
        let queryObj = {
            query,
            args: [payload],
            event: "find all"
        }
        dbHandler.executeQuery(queryObj)
            .then((result) => {
                resolve(result);
            }).catch((err) => {
                reject(err);
            });
    });
}

const findByUsecaseId = (usecase_id) => {
    return new Promise(async (resolve, reject) => {
        const query = `SELECT * FROM generate_usecases WHERE usecase_id=?`;
        let queryObj = {
            query,
            args: [usecase_id],
            event: "find by usecase id"
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
    findAll,
    findByUsecaseId
}