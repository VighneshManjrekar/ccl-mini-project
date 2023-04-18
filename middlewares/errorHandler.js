const ErrorResponse = require("../utils/ErrorResponse");

const errorHandler = (err, req, res, next) => {
  const error = { ...err };
  if (process.env.NODE_ENV == "development") {
    console.log(err);
  }

  error.message = err.message;
  error.name = err.name;

  if (error.name == "CastError") {
    error.message = `Invalid Resource Id`;
    new ErrorResponse(error.message, 404);
  }

  if (error.code == 11000) {
    error.message = `${Object.keys(err.keyValue)} already exists`;
    error.status = 400;
    new ErrorResponse(error.message, error.status);
  }

  if (error.name == "JsonWebTokenError" && error.message == "jwt malformed") {
    error.message = "Invalid token";
    error.status = 401;
    new ErrorResponse(error.message, error.status);
  }

  res
    .status(error.status || 500)
    .json({ success: false, error: error.message || "Internal Server Error" });
};

module.exports = errorHandler;
