const config = require("config");
module.exports = {
    ...config,
    port: process.env.PORT || 80,
    env: process.env.NODE_ENV
}