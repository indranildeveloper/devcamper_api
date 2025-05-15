import ErrorResponse from "../utils/ErrorResponse.js";

/**
 * Express error handling middleware to process and respond to errors.
 *
 * Handles specific Mongoose errors (CastError, duplicate key, ValidationError)
 * and formats them into standardized API error responses.
 *
 * @function
 * @param {Object} err - The error object.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The next middleware function.
 * @returns {void}
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;

  console.log(err.stack.red);

  // Mongoose bad Object ID
  if (err.name === "CastError") {
    const message = `Resource not found!`;
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = "Duplicate field value entered!";
    error = new ErrorResponse(message, 409);
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Internal server error!",
  });
};

export default errorHandler;
