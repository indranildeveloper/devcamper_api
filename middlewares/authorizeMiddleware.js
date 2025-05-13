import ErrorResponse from "../utils/ErrorResponse.js";

const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is unauthorize to access this resource!`,
          403
        )
      );
    }
    next();
  };
};

export default authorizeRole;
