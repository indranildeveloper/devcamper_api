import express from "express";
import {
  getCourses,
  getCourse,
  createCourse,
} from "../controllers/courseControllers.js";

const router = express.Router({ mergeParams: true });

router.route("/").get(getCourses).post(createCourse);
router.route("/:courseId").get(getCourse);

export default router;
