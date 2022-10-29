const httpStatus = require("http-status");
const catchAsync = require("../utils/CatchAsync");
const {articleService} =require("../services");
const {ARTICLE} = require("../utils/constants");
const { saveArticleById } = require("../services/article.service");


const create = catchAsync(async (req, res) => {
    const {keyword,location,user_id,title} = req.body;
    const articleId = await articleService.createArticle(user_id,keyword,title,location);
    res.status(httpStatus.CREATED).send({
        articleId,
        message : ARTICLE.SUCCESS.CREATED
    });
});

const getAllArticles = catchAsync(async (req, res) => {
    const {user_id} = req.query;
    const articles = await articleService.getAllArticles(user_id);
    res.status(httpStatus.OK).send({
        articles,
        message : "success"
    });
});

const getArticleById = catchAsync(async (req, res) => {
    const {articleId} = req.params;
    const {user_id} = req.query;
    const articleInfo = await articleService.getArticle(user_id,articleId);
    res.status(httpStatus.OK).send({
        articleInfo,
        message : "success"
    });
});


const saveArticle = catchAsync(async (req, res) => {
    const {articleId,htmlContent,user_id} = req.body;
    await articleService.saveArticleById(user_id,articleId,htmlContent);
    res.status(httpStatus.OK).send({
        message : "saved successfully"
    });
});

const getArticleStatus = catchAsync(async (req, res) => {
    const {articleId} = req.params;
    const {user_id} = req.query;
    const articleInfo = await articleService.getArticleInfo(user_id,articleId);
    res.status(httpStatus.OK).send({
        articleInfo,
        message : "success"
    });
});



module.exports = {
    create,
    getArticleById,
    getAllArticles,
    saveArticle,
    getArticleStatus
}

