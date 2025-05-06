import express from "express";
import {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../controllers/courseControllers.js";

const router = express.Router({ mergeParams: true });

router.route("/").get(getCourses).post(createCourse);
router
  .route("/:courseId")
  .get(getCourse)
  .put(updateCourse)
  .delete(deleteCourse);

export default router;
