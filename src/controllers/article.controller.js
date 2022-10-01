const httpStatus = require("http-status");
const catchAsync = require("../utils/CatchAsync");
const {articleService} =require("../services");

const create = catchAsync(async (req, res) => {
    const {keyword,location} = req.body;
    const article = await articleService.createArticle(keyword,location);
    res.status(httpStatus.CREATED).send(article);
});


module.exports = {
    create
}

