const httpStatus = require("http-status");
const catchAsync = require("../utils/CatchAsync");
const {generateService} =require("../services");

const getAllUsecases = catchAsync(async (req, res) => {
    const usecases = await generateService.getAllUsecases();
    return res.status(httpStatus.OK).send(usecases);
});

const generate = catchAsync(async (req, res) => {
    const request = {...req.body};
    const usecaseInfo = await generateService.getUsecaseById(request.usecaseId);
    const completion = await generateService.generate(request,usecaseInfo);
    return res.status(httpStatus.OK).send(completion);
});


module.exports = {
    getAllUsecases,
    generate
}