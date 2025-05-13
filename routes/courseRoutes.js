import express from "express";
import {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../controllers/courseControllers.js";
import Course from "../models/CourseModel.js";
import advancedResults from "../middlewares/advancedResultsMiddleware.js";
import protectRoute from "../middlewares/authMiddleware.js";
import authorizeRole from "../middlewares/authorizeMiddleware.js";

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(
    advancedResults(Course, {
      path: "bootcamp",
      select: "name description",
    }),
    getCourses
  )
  .post(protectRoute, authorizeRole("publisher", "admin"), createCourse);
router
  .route("/:courseId")
  .get(getCourse)
  .put(protectRoute, authorizeRole("publisher", "admin"), updateCourse)
  .delete(protectRoute, authorizeRole("publisher", "admin"), deleteCourse);

export default router;
