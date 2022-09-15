const mysql = require("mysql");
const config = require("./config");

let connection = mysql.createPool({
  host: config.db.host,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
  charset: 'utf8mb4'
});

connection.getConnection((err, connection) => {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }

  console.log("mysql connected ");
});

let dbHandler = {
  executeQuery: function (queryObj) {
    return new Promise((resolve, reject) => {
      const start = new Date();
      queryObj.query = queryObj.query.replace(/\s+/g, " ");
      let finalQuery = connection.query(
        queryObj.query,
        queryObj.args,
        (err, result) => {
          queryObj.sql = finalQuery.sql;
          // console.log("final",finalQuery);
          //console.log("Query ",queryObj);
          queryObj.sql = queryObj.sql.replace(/[\n\t]/g, "");

          let event = queryObj.event || "Executing mysql query";

          if (err && err.code !== "ER_DUP_ENTRY") {
            let message = `*QUERY ERROR*`;
            message += "\n*Query* :" + finalQuery.sql;
            message += "\n*Error* :" + err;
          }

          if (
            err &&
            (err.code === "ER_LOCK_DEADLOCK" ||
              err.code === "ER_QUERY_INTERRUPTED")
          ) {
            setTimeout(() => {
              module.exports.dbHandler.executeQuery(queryObj).then(
                (result) => resolve(result),
                (error, result) => reject(error, result)
              );
            }, 50);
          } else if (err) {
            return reject(err, result);
          } else {
            return resolve(result);
          }
        }
      );
    });
  }
}

module.exports = {
    dbHandler
}