import express from "express";
import {
  registerUser,
  loginUser,
  getCurrentUser,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
import protectRoute from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/currentUser").get(protectRoute, getCurrentUser);
router.route("/forgotpassword").post(forgotPassword);
router.route("/resetpassword/:resetToken").put(resetPassword);

export default router;
