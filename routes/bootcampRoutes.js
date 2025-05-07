import express from "express";
import {
  createBootcamp,
  deleteBootcamp,
  getBootcamp,
  getBootcamps,
  updateBootcamp,
  getBootcampsInRadius,
  uploadBootcampPhoto,
} from "../controllers/bootcampControllers.js";
import Bootcamp from "../models/BootcampModel.js";
import advancedResults from "../middlewares/advancedResults.js";
// Include other resource routers
import courseRouter from "./courseRoutes.js";

const router = express.Router();

// Re-route into other resource router
router.use("/:bootcampId/courses", courseRouter);

router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);
router.route("/:bootcampId/photo").put(uploadBootcampPhoto);
router
  .route("/")
  .get(advancedResults(Bootcamp, "courses"), getBootcamps)
  .post(createBootcamp);
router
  .route("/:bootcampId")
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

export default router;
