import express from "express";
import { getCourses } from "../controllers/courseControllers.js";

const router = express.Router({ mergeParams: true });

router.route("/").get(getCourses);

export default router;
