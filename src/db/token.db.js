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

const findToken = (payload) => {
  return new Promise(async (resolve, reject) => {
    const query = `SELECT * FROM tokens WHERE user_id=? AND type=? AND blacklisted=? AND token=?`;
    let queryObj = {
      query,
      args: [payload.user_id,payload.type,payload.blacklisted, payload.token],
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

const updateToken = (payload)=>{
  if (!Object.keys(payload.fields).length)
      return Promise.reject("fields cannot be empty");
  return new Promise((resolve, reject) => {
      let query = `UPDATE tokens SET `;
      let { fields } = payload;
      query = Object.keys(fields).reduce(
          (acc, curr) => acc + ` ${curr} ` + " = ?,",
          query
      );

      query = query.slice(0, -1) + ` WHERE id = ? `;
      console.log(query);
      let queryObj = {
          query: query,
          args: [...Object.values(payload.fields), payload.token_id],
          event: "update Token",
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

module.exports = {
  create,
  findToken,
  updateToken
}