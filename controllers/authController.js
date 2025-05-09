import User from "../models/UserModel.js";
import asyncHandler from "../middlewares/asyncMiddleware.js";
import ErrorResponse from "../utils/ErrorResponse.js";

/**
 * @desc    Register user
 * @route   GET /api/v1/auth/register
 * @access  Public
 */
export const registerUser = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
  });
});
