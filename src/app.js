const express = require('express');
const app = express();
const cors = require("cors");
const config = require("./config");
const morgan = require("./config/morgan");
const httpStatus = require("http-status");
const { errorConverter, errorHandler } = require("./middlewares/error");
const ApiError = require("./utils/ApiError");

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// parse the json request body
app.use(express.json());
// parse the urlencoded request body
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.get("/", (req, res) => {
  return res.send(
    "Hello, Programmer 👋"
  )
})

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, app_version, device_type, access_token,app_secret_key, auth_token, Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "POST, GET, PUT, DELETE, OPTIONS,PATCH"
  );
  res.setHeader("X-Frame-Options", "DENY");
  next();
});

app.use("/api", require("./routes"));

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;