const http = require("http");
if (!process.env.NODE_ENV)
    process.env.NODE_ENV = "development"
process.env.NODE_CONFIG_DIR = __dirname + "/config/";
const app = require("./app");

let allowedEnv = ["development", "production", "test"];

if (!allowedEnv.includes(process.env.NODE_ENV)) {
    console.log("Please specify the environment variable NODE_ENV");
    process.exit(0);
}

const config = require("./config");
const db = require("./db");


const httpServer = http.createServer(app);
const PORT = config.port || 3000;


httpServer.listen(PORT, () => {
    console.log(`${config.env} server is running on port ${PORT}`);
})