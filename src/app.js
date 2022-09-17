const express = require('express');
const app = express();


// parse the json request body
app.use(express.json());
// parse the urlencoded request body
app.use(express.urlencoded({ extended: true }));

app.use("/api",require("./routes"));
module.exports = app;