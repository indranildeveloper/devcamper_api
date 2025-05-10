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
  .post(protectRoute, createCourse);
router
  .route("/:courseId")
  .get(getCourse)
  .put(protectRoute, updateCourse)
  .delete(protectRoute, deleteCourse);

export default router;
