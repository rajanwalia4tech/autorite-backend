const express = require('express');
const app = express();
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
app.get("/hello", (req, res) => {
  return res.send(
    "Hello World"
  )
})
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