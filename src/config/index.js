const config = require("config");

module.exports = {
    ...config,
    env : process.env.NODE_ENV
}