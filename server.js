const http = require("http");
const app = require("./app");
const config = require("./config");
const db = require("./db");
console.log(config);

const httpServer = http.createServer(app);
const PORT = config.port || 5000;

httpServer.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})