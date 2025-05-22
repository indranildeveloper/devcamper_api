import express from "express";
import {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
} from "../controllers/reviewController.js";
import Review from "../models/ReviewModel.js";
import advancedResults from "../middlewares/advancedResultsMiddleware.js";
import protectRoute from "../middlewares/authMiddleware.js";
import authorizeRole from "../middlewares/authorizeMiddleware.js";

const router = express.Router({ mergeParams: true });

/**
 * @swagger
 * /api/v1/reviews:
 *   get:
 *     summary: Get all reviews
 *     description: Retrieve a list of all reviews with optional filtering and pagination
 *     tags: [Reviews]
 *     parameters:
 *       - in: query
 *         name: select
 *         schema:
 *           type: string
 *         description: Fields to select (e.g., "title,rating")
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sort by field (prefix with - for descending order)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Maximum number of reviews per page
 *     responses:
 *       200:
 *         description: Successfully retrieved reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 6
 *                 pagination:
 *                   type: object
 *                   properties: {}
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "5d7a514b5d2c12c7449be022"
 *                       title:
 *                         type: string
 *                         example: "Got me a developer job"
 *                       text:
 *                         type: string
 *                         example: "Lorem ipsum dolor sit amet, consectetur adipiscing elit..."
 *                       rating:
 *                         type: integer
 *                         minimum: 1
 *                         maximum: 10
 *                         example: 7
 *                       bootcamp:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "5d713a66ec8f2b88b8f830b8"
 *                           name:
 *                             type: string
 *                             example: "ModernTech Bootcamp"
 *                           description:
 *                             type: string
 *                             example: "ModernTech has one goal, and that is to make you a rockstar developer and/or designer with a six figure salary"
 *                           id:
 *                             type: string
 *                             example: "5d713a66ec8f2b88b8f830b8"
 *                       user:
 *                         type: string
 *                         example: "5c8a1d5b0190b214360dc035"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-05-15T07:27:15.269Z"
 *                       __v:
 *                         type: integer
 *                         example: 0
 *       400:
 *         description: Bad request - Invalid query parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Invalid query parameters"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */

/**
 * @swagger
 * /api/v1/bootcamps/{bootcampId}/reviews:
 *   get:
 *     summary: Get reviews for a specific bootcamp
 *     description: Retrieve all reviews for a specific bootcamp
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: bootcampId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the bootcamp to get reviews for
 *     responses:
 *       200:
 *         description: Successfully retrieved reviews for the bootcamp
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 2
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "5d7a514b5d2c12c7449be026"
 *                       title:
 *                         type: string
 *                         example: "Best instructors"
 *                       text:
 *                         type: string
 *                         example: "Lorem ipsum dolor sit amet, consectetur adipiscing elit..."
 *                       rating:
 *                         type: integer
 *                         minimum: 1
 *                         maximum: 10
 *                         example: 10
 *                       bootcamp:
 *                         type: string
 *                         example: "5d725a1b7b292f5f8ceff788"
 *                       user:
 *                         type: string
 *                         example: "5c8a1d5b0190b214360dc039"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-05-15T07:27:15.269Z"
 *                       __v:
 *                         type: integer
 *                         example: 0
 *       404:
 *         description: Bootcamp not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "No bootcamp with the id of `bootcampId` was found!"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */

/**
 * @swagger
 * /api/v1/reviews/{reviewId}:
 *   get:
 *     summary: Get a single review
 *     description: Retrieve details of a specific review by its ID
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the review to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved the review
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "5d7a514b5d2c12c7449be027"
 *                     title:
 *                       type: string
 *                       example: "Was worth the investment"
 *                     text:
 *                       type: string
 *                       example: "Lorem ipsum dolor sit amet, consectetur adipiscing elit..."
 *                     rating:
 *                       type: integer
 *                       minimum: 1
 *                       maximum: 10
 *                       example: 7
 *                     bootcamp:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: "5d725a1b7b292f5f8ceff788"
 *                         name:
 *                           type: string
 *                           example: "Devcentral Bootcamp"
 *                         description:
 *                           type: string
 *                           example: "Is coding your passion? Codemasters will give you the skills and the tools to become the best developer possible. We specialize in front end and full stack web development"
 *                         id:
 *                           type: string
 *                           example: "5d725a1b7b292f5f8ceff788"
 *                     user:
 *                       type: string
 *                       example: "5c8a1d5b0190b214360dc040"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-05-15T07:27:15.269Z"
 *                     __v:
 *                       type: integer
 *                       example: 0
 *       404:
 *         description: Review not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "No review found with the ID of `reviewId`"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */

/**
 * @swagger
 * /api/v1/bootcamps/{bootcampId}/reviews:
 *   post:
 *     summary: Create a new review for a bootcamp
 *     description: Create a new review for the specified bootcamp (requires user or admin role)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bootcampId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the bootcamp to review
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - text
 *               - rating
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the review
 *                 example: "Great Job"
 *               text:
 *                 type: string
 *                 description: Detailed review content
 *                 example: "Learnt a lot from this course."
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 10
 *                 description: Rating from 1 to 10
 *                 example: 10
 *     responses:
 *       201:
 *         description: Review created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                       example: "Great Job"
 *                     text:
 *                       type: string
 *                       example: "Learnt a lot from this course."
 *                     rating:
 *                       type: integer
 *                       example: 10
 *                     bootcamp:
 *                       type: string
 *                       example: "5d713a66ec8f2b88b8f830b8"
 *                     user:
 *                       type: string
 *                       example: "5d7a514b5d2c12c7449be044"
 *                     _id:
 *                       type: string
 *                       example: "682ef1ea28077672a9e2f7d0"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-05-22T09:44:10.756Z"
 *                     __v:
 *                       type: integer
 *                       example: 0
 *       400:
 *         description: Bad request - Missing or invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Please add a title, text and rating"
 *       401:
 *         description: Unauthorized - Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Not authorized to access this route"
 *       403:
 *         description: Forbidden - User not authorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "User is not authorized to add a review"
 *       404:
 *         description: Bootcamp not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "No bootcamp with the id of `bootcampId`"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */

/**
 * @swagger
 * /api/v1/reviews/{reviewId}:
 *   put:
 *     summary: Update a review
 *     description: Update an existing review (requires user or admin role)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the review to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Updated title of the review
 *                 example: "[Updated] Had Fun"
 *               text:
 *                 type: string
 *                 description: Updated review content
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 10
 *                 description: Updated rating from 1 to 10
 *     responses:
 *       200:
 *         description: Review updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "682ef1ea28077672a9e2f7d0"
 *                     title:
 *                       type: string
 *                       example: "[Updated] Had Fun"
 *                     text:
 *                       type: string
 *                       example: "Learnt a lot from this course."
 *                     rating:
 *                       type: integer
 *                       example: 10
 *                     bootcamp:
 *                       type: string
 *                       example: "5d713a66ec8f2b88b8f830b8"
 *                     user:
 *                       type: string
 *                       example: "5d7a514b5d2c12c7449be044"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-05-22T09:44:10.756Z"
 *                     __v:
 *                       type: integer
 *                       example: 0
 *       400:
 *         description: Bad request - Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Please provide valid data to update"
 *       401:
 *         description: Unauthorized - Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Not authorized to access this route"
 *       403:
 *         description: Forbidden - User not authorized to update this review
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "User is not authorized to update this review"
 *       404:
 *         description: Review not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "No review found with the ID of `reviewId`"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */

/**
 * @swagger
 * /api/v1/reviews/{reviewId}:
 *   delete:
 *     summary: Delete a review
 *     description: Delete an existing review (requires user or admin role)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the review to delete
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   example: {}
 *       401:
 *         description: Unauthorized - Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Not authorized to access this route"
 *       403:
 *         description: Forbidden - User not authorized to delete this review
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "User is not authorized to delete this review"
 *       404:
 *         description: Review not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "No review found with the ID of `reviewId`"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */

router
  .route("/")
  .get(
    advancedResults(Review, {
      path: "bootcamp",
      select: "name description",
    }),
    getReviews,
  )
  .post(protectRoute, authorizeRole("user", "admin"), createReview);

router
  .route("/:reviewId")
  .get(getReview)
  .put(protectRoute, authorizeRole("user", "admin"), updateReview)
  .delete(protectRoute, authorizeRole("user", "admin"), deleteReview);

export default router;
