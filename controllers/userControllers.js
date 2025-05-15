import User from "../models/UserModel.js";
import asyncHandler from "../middlewares/asyncMiddleware.js";
import ErrorResponse from "../utils/ErrorResponse.js";
import sendTokenResponse from "../utils/sendTokenResponse.js";

/**
 * @desc    Get all users
 * @route   GET /api/v1/auth/users
 * @access  Private/Admin
 */
export const getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

/**
 * @desc    Get single user
 * @route   GET /api/v1/auth/users/:userId
 * @access  Private/Admin
 */
export const getSingleUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.userId);

  res.status(200).json({
    success: true,
    data: user,
  });
});

/**
 * @desc    Create user
 * @route   POST /api/v1/auth/users
 * @access  Private/Admin
 */
export const createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(201).json({
    success: true,
    data: user,
  });
});

/**
 * @desc    Update user
 * @route   PUT /api/v1/auth/users/:userId
 * @access  Private/Admin
 */
export const updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.userId, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: user,
  });
});

/**
 * @desc    Delete user
 * @route   DELETE /api/v1/auth/users/:userId
 * @access  Private/Admin
 */
export const deleteUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.userId);

  res.status(200).json({
    success: true,
    data: {},
  });
});
