const { dbHandler } = require("./db");

const create = (payload) => {
  return new Promise(async (resolve, reject) => {
    const query = `INSERT INTO tokens SET ?`;
    let queryObj = {
      query,
      args: [payload],
      event: "create token"
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
  create
}