import jwt from "jsonwebtoken";
import asyncHandler from "./asyncMiddleware.js";
import ErrorResponse from "../utils/ErrorResponse.js";
import User from "../models/UserModel.js";

// Protect route
const protectRoute = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // else if(req.cookies.token) {
  //   token = req.cookies.token
  // }

  // Make sure token exists
  if (!token) {
    return next(
      new ErrorResponse("Not authorized to access this resource!", 401)
    );
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id);

    next();
  } catch (error) {
    return next(
      new ErrorResponse("Not authorized to access this resource!", 401)
    );
  }
});

export default protectRoute;
