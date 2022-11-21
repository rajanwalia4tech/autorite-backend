const mysql = require("mysql2");
const config = require("../config");

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
          //console.log("final", finalQuery);
          // console.log("Query ", queryObj);
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
  },
  generateUpdateQuery : ( tableName,data, clauseKey, clauseValue) =>{
    let part1 = `UPDATE ${tableName} SET`;
    let part2 ="";
    if(clauseKey && clauseValue)
      part2 = ` WHERE ${clauseKey} = ${clauseValue};`; //Add any number of filter clause statements here
    let updateString = "";
    for (let key in data) {
        updateString += `${key} = '${data[key]}',`;
    }
    updateString = updateString.slice(0, -1);
    let query = `${part1} ${updateString} ${part2}`;
    return query;
  },
  generateInsertQuery : (tableName,data)=>{
    let part1 = `INSERT INTO ${tableName} (`;
    let part2 = ")",
        part3 = "VALUES (",
        part4 = ")";
    let tableKeys = "",
        tableValues = "";
    for (let key in data) {
        tableKeys += `${key},`;
        tableValues += `'${data[key]}',`
    }
    tableKeys = tableKeys.slice(0, -1);
    tableValues = tableValues.slice(0, -1);
    let query = `${part1}${tableKeys}${part2} ${part3}${tableValues}${part4}`;
    return query;
  },
  generateSelectQuery : (tableName,data, clauseKey, clauseValue) =>{
    let part1 = `SELECT`;
    let part2 = `FROM ${tableName}`;
    let part3 = "";
    if(clauseKey && clauseValue)
      part3 = ` WHERE ${clauseKey} = ${clauseValue};`; //Add any number of filter clause statements here
    let selectFields = "";
    for (let field of data) {
        selectFields += `${field},`;
    }
    selectFields = selectFields.slice(0, -1);
    let query = `${part1} ${selectFields} ${part2} ${part3}`;
    return query;
  },
}

module.exports = {
  dbHandler
}