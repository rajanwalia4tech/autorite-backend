const httpStatus = require("http-status");
const catchAsync = require("../utils/CatchAsync");
const {commonService} = require("../services");


const getLocations = catchAsync(async (req, res) => {
    const {query} = req.query;
    const locations = await commonService.getLocationByQuery(query);
    res.status(httpStatus.CREATED).send({ locations });
});


module.exports = {
    getLocations
}