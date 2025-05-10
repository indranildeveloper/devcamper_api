import express from "express";
import {
  registerUser,
  loginUser,
  getCurrentUser,
} from "../controllers/authController.js";
import protectRoute from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/currentUser").get(protectRoute, getCurrentUser);

export default router;
