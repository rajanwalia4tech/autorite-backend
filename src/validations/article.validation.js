const Joi = require("joi");

const getArticleById = {
    params: Joi.object().keys({
        articleId: Joi.number().required(),
    })
};

module.exports = {
    getArticleById
}