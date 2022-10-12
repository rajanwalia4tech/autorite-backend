const Joi = require("joi");

const connect = {
    body: Joi.object().keys({
        domain: Joi.string().required(),
        password: Joi.string().required(),
        username: Joi.string().required(),
    }),
};

module.exports = {
    connect
}