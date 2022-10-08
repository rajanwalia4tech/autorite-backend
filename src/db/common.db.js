const {dbHandler} = require("./db");

function getLocationByQuery(payload) {
    return new Promise((resolve, reject) => {
      let values = [];
      let query = "SELECT id,name,canonical_name full_name,target_type type,country_code,reach FROM `locations` ORDER BY reach DESC LIMIT 20;";
      if (payload.queries && payload.queries.length > 0) {
        let fillers = "";
        let placeHolders;
        for (let i = 1; i <= payload.queries.length; i++) fillers += ",?,'%'";
        placeHolders = new Array(payload.permutations.length)
          .fill(`CONCAT('%'${fillers})`)
          .join(" OR canonical_name like ");
  
        if (payload.queries.length != 1) {
          for (let arr of payload.permutations) {
            for (let value in arr) {
              values = values.concat(arr[value]);
            }
          }
        } else values = payload.permutations;
        query = `SELECT name,canonical_name full_name,target_type type,country_code,reach FROM locations WHERE canonical_name LIKE ${placeHolders}  ORDER BY reach DESC LIMIT 10;`;
      }
      let queryObj = {
        query: query,
        args: values,
        event: "getLocationByQuery",
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
  

  module.exports={
    getLocationByQuery
  }