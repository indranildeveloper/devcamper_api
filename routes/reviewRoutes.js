import express from "express";
import {
  getReviews,
  getReview,
  createReview,
} from "../controllers/reviewController.js";
import Review from "../models/ReviewModel.js";
import advancedResults from "../middlewares/advancedResultsMiddleware.js";
import protectRoute from "../middlewares/authMiddleware.js";
import authorizeRole from "../middlewares/authorizeMiddleware.js";

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(
    advancedResults(Review, {
      path: "bootcamp",
      select: "name description",
    }),
    getReviews
  )
  .post(protectRoute, authorizeRole("user", "admin"), createReview);

router.route("/:reviewId").get(getReview);

export default router;
