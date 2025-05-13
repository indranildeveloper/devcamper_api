import User from "../models/UserModel.js";
import asyncHandler from "../middlewares/asyncMiddleware.js";
import ErrorResponse from "../utils/ErrorResponse.js";
import sendTokenResponse from "../utils/sendTokenResponse.js";

/**
 * @desc    Register user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
export const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  // Create user
  const user = await User.create({ name, email, password, role });

  sendTokenResponse(user, 200, res);
});

/**
 * @desc    Login user
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
export const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email and password
  if (!email || !password) {
    return next(
      new ErrorResponse("Please provide an email and password!", 400)
    );
  }

  // Check for user
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorResponse("Invalid credentials!", 401));
  }

  // Check if password matches
  const isPasswordMatch = await user.matchPassword(password);

  if (!isPasswordMatch) {
    return next(new ErrorResponse("Invalid credentials!", 401));
  }

  sendTokenResponse(user, 200, res);
});

/**
 * @desc    Get the current logged in user
 * @route   GET /api/v1/auth/currentUser
 * @access  Private
 */
export const getCurrentUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({ success: true, data: user });
});

/**
 * @desc    Forgot password
 * @route   GET /api/v1/auth/forgotpassword
 * @access  Public
 */
export const forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse("There is no user with that email!", 404));
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  res.status(200).json({ success: true, data: user });
});
