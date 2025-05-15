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
import advancedResults from "../middlewares/advancedResultsMiddleware.js";
import protectRoute from "../middlewares/authMiddleware.js";
import authorizeRole from "../middlewares/authorizeMiddleware.js";
// Include other resource routers
import courseRouter from "./courseRoutes.js";
import reviewRouter from "./reviewRoutes.js";

const router = express.Router();

// Re-route into other resource router
router.use("/:bootcampId/courses", courseRouter);
router.use("/:bootcampId/reviews", reviewRouter);

router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);
router
  .route("/:bootcampId/photo")
  .put(protectRoute, authorizeRole("publisher", "admin"), uploadBootcampPhoto);
router
  .route("/")
  .get(advancedResults(Bootcamp, "courses"), getBootcamps)
  .post(protectRoute, authorizeRole("publisher", "admin"), createBootcamp);
router
  .route("/:bootcampId")
  .get(getBootcamp)
  .put(protectRoute, authorizeRole("publisher", "admin"), updateBootcamp)
  .delete(protectRoute, authorizeRole("publisher", "admin"), deleteBootcamp);

export default router;
