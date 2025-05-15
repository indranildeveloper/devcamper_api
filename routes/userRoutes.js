import express from "express";
import {
  getUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userControllers.js";
import User from "../models/UserModel.js";
import advancedResults from "../middlewares/advancedResultsMiddleware.js";
import protectRoute from "../middlewares/authMiddleware.js";
import authorizeRole from "../middlewares/authorizeMiddleware.js";

const router = express.Router({ mergeParams: true });

router.use(protectRoute);
router.use(authorizeRole("admin"));

router.route("/").get(advancedResults(User), getUsers).post(createUser);
router.route("/:userId").get(getSingleUser).put(updateUser).delete(deleteUser);

export default router;
