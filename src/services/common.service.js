const {Common} = require("../db");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");
const {COMMON} = require("../utils/constants");

function permutations(arr) {
    if (arr.length <= 2) return arr.length === 2 ? [arr, [arr[1], arr[0]]] : arr;
    return arr.reduce(
        (acc, item, i) =>
        acc.concat(
            permutations([...arr.slice(0, i), ...arr.slice(i + 1)]).map((val) => [
            item,
            ...val,
            ])
        ),
        []
    );
}
  
async function getLocationByQuery(query) {
    try {
      let locations = []
      if (!query || query.length == 0) {
        locations = COMMON.DEFAULT_LOCATIONS;
      } else {
        let queries = query.split(" ");
        queries = queries.filter((query) => query.length != 0);
        queries = queries.slice(0, 4);
        const resultPermutations = permutations(queries);
        locations = await Common.getLocationByQuery({
          queries,
          permutations: resultPermutations,
        });
      }
      return locations;
    } catch (err) {
        throw new ApiError(httpStatus.BAD_REQUEST,COMMON.ERROR.LOCATION_FETCH);
    }
}

module.exports={
    getLocationByQuery
}
  