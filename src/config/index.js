const config = require("config");
module.exports = {
    ...config,
    port: process.env.PORT || 8080,
    env: process.env.NODE_ENV
}