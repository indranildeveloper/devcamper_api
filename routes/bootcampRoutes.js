import express from "express";
import {
  createBootcamp,
  deleteBootcamp,
  getBootcamp,
  getBootcamps,
  updateBootcamp,
} from "../controllers/bootcampControllers.js";

const router = express.Router();

router.route("/").get(getBootcamps).post(createBootcamp);
router
  .route("/:bootcampId")
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

export default router;
