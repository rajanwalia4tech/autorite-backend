const Joi = require("joi");

const getArticleById = {
    params: Joi.object().keys({
        articleId: Joi.number().required(),
    })
};

const create = {
    body: Joi.object().keys({
        keyword: Joi.string().required(),
        location: Joi.string().required(),
    }),
};

module.exports = {
    getArticleById,
    create
}