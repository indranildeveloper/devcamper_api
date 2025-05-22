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

/**
 * @swagger
 * /api/v1/courses:
 *  get:
 *    summary: Get all courses
 *    tags: [Courses]
 *    description: Get all courses with optional filtering and pagination
 *    parameters:
 *      - in: query
 *        name: select
 *        schema:
 *          type: string
 *        description: Select specific fields to return (comma-separated)
 *      - in: query
 *        name: sort
 *        schema:
 *          type: string
 *        description: Sort results by specified fields (prefix with - for descending)
 *      - in: query
 *        name: page
 *        schema:
 *          type: integer
 *          default: 1
 *        description: Page number for pagination
 *      - in: query
 *        name: limit
 *        schema:
 *          type: integer
 *          default: 10
 *        description: Number of items per page
 *      - in: query
 *        name: minimumSkill
 *        schema:
 *          type: string
 *          enum: [beginner, intermediate, advanced]
 *        description: Filter by minimum skill level
 *      - in: query
 *        name: tuition[lt]
 *        schema:
 *          type: number
 *        description: Filter by tuition less than
 *      - in: query
 *        name: tuition[lte]
 *        schema:
 *          type: number
 *        description: Filter by tuition less than or equal to
 *      - in: query
 *        name: tuition[gt]
 *        schema:
 *          type: number
 *        description: Filter by tuition greater than
 *      - in: query
 *        name: tuition[gte]
 *        schema:
 *          type: number
 *        description: Filter by tuition greater than or equal to
 *    responses:
 *      200:
 *        description: Successfully retrieved courses
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  example: true
 *                count:
 *                  type: integer
 *                  example: 9
 *                pagination:
 *                  type: object
 *                  example: {}
 *                data:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      _id:
 *                        type: string
 *                        example: "5d725cd2c4ded7bcb480eaa2"
 *                      title:
 *                        type: string
 *                        example: "UI/UX"
 *                      description:
 *                        type: string
 *                        example: "In this course you will learn to create beautiful interfaces..."
 *                      weeks:
 *                        type: string
 *                        example: "12"
 *                      tuition:
 *                        type: integer
 *                        example: 10000
 *                      minimumSkill:
 *                        type: string
 *                        enum: [beginner, intermediate, advanced]
 *                        example: "intermediate"
 *                      scholarshipAvailable:
 *                        type: boolean
 *                        example: false
 *                      bootcamp:
 *                        type: object
 *                        nullable: true
 *                        properties:
 *                          _id:
 *                            type: string
 *                            example: "5d713a66ec8f2b88b8f830b8"
 *                          name:
 *                            type: string
 *                            example: "ModernTech Bootcamp"
 *                          description:
 *                            type: string
 *                            example: "ModernTech has one goal..."
 *                          id:
 *                            type: string
 *                            example: "5d713a66ec8f2b88b8f830b8"
 *                      user:
 *                        type: string
 *                        example: "5d7a514b5d2c12c7449be046"
 *                      createdAt:
 *                        type: string
 *                        format: date-time
 *                        example: "2025-05-15T07:27:14.467Z"
 *                      __v:
 *                        type: integer
 *                        example: 0
 *      400:
 *        description: Invalid query parameters
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  example: false
 *                error:
 *                  type: string
 *                  example: "Invalid query parameters!"
 *      500:
 *        description: Server error
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  example: false
 *                error:
 *                  type: string
 *                  example: "Internal Server Error!"
 */

/**
 * @swagger
 * /api/v1/bootcamps/{bootcampId}/courses:
 *   post:
 *     summary: Create a new course in a bootcamp
 *     description: Create a new course within the specified bootcamp (requires authentication and publisher/admin role).
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bootcampId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the bootcamp to add the course to
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - weeks
 *               - tuition
 *               - minimumSkill
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Full Stack Web Development 3"
 *               description:
 *                 type: string
 *                 example: "In this course you will learn full stack web development..."
 *               weeks:
 *                 type: integer
 *                 example: 12
 *               tuition:
 *                 type: number
 *                 example: 22500
 *               minimumSkill:
 *                 type: string
 *                 enum: [beginner, intermediate, advanced]
 *                 example: "intermediate"
 *               scholarshipsAvailable:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Course created successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 _id: "682ecb8495cbe725a154f3be"
 *                 title: "Full Stack Web Development 3"
 *                 description: "In this course you will learn full stack web development..."
 *                 weeks: "12"
 *                 tuition: 22500
 *                 minimumSkill: "intermediate"
 *                 scholarshipAvailable: false
 *                 bootcamp: "682dfb17f89c16f97a1eca52"
 *                 user: "5d7a514b5d2c12c7449be045"
 *                 createdAt: "2025-05-22T07:00:20.904Z"
 *                 __v: 0
 *       400:
 *         description: Bad request - Invalid input data
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error: "Please add a title"
 *       401:
 *         description: Unauthorized - Authentication required
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error: "Not authorized to access this route"
 *       403:
 *         description: Forbidden - User is not authorized to add a course to this bootcamp
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error: "User is not authorized to add a course to this bootcamp"
 *       404:
 *         description: Bootcamp not found
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error: "No bootcamp with the id of `bootcampId` was found!"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error: "Internal Server Error!"
 */

/**
 * @swagger
 * /api/v1/bootcamps/{bootcampId}/courses:
 *   get:
 *     summary: Get all courses for a specific bootcamp
 *     description: Retrieve a list of all courses associated with a specific bootcamp
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: bootcampId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the bootcamp to get courses for
 *     responses:
 *       200:
 *         description: Successfully retrieved courses for the bootcamp
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               count: 2
 *               data:
 *                 - _id: "5d725a4a7b292f5f8ceff789"
 *                   title: "Front End Web Development"
 *                   description: "This course will provide you with all of the essentials to become a successful frontend web developer..."
 *                   weeks: "8"
 *                   tuition: 8000
 *                   minimumSkill: "beginner"
 *                   scholarshipAvailable: false
 *                   bootcamp: "5d713995b721c3bb38c1f5d0"
 *                   user: "5d7a514b5d2c12c7449be045"
 *                   createdAt: "2025-05-15T07:27:14.466Z"
 *                   __v: 0
 *                 - _id: "5d725c84c4ded7bcb480eaa0"
 *                   title: "Full Stack Web Development"
 *                   description: "In this course you will learn full stack web development..."
 *                   weeks: "12"
 *                   tuition: 10000
 *                   minimumSkill: "intermediate"
 *                   scholarshipAvailable: false
 *                   bootcamp: "5d713995b721c3bb38c1f5d0"
 *                   user: "5d7a514b5d2c12c7449be045"
 *                   createdAt: "2025-05-15T07:27:14.466Z"
 *                   __v: 0
 *       404:
 *         description: Bootcamp not found
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error: "No bootcamp with the id of `bootcampId` was found!"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error: "Internal Server Error!"
 */

/**
 * @swagger
 * /api/v1/courses/{courseId}:
 *   get:
 *     summary: Get a single course by ID
 *     description: Retrieve details of a specific course by its ID
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the course to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved the course
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 _id: "5d725a4a7b292f5f8ceff789"
 *                 title: "Front End Web Development"
 *                 description: "This course will provide you with all of the essentials to become a successful frontend web developer..."
 *                 weeks: "8"
 *                 tuition: 8000
 *                 minimumSkill: "beginner"
 *                 scholarshipAvailable: false
 *                 bootcamp: null
 *                 user: "5d7a514b5d2c12c7449be045"
 *                 createdAt: "2025-05-15T07:27:14.466Z"
 *                 __v: 0
 *       404:
 *         description: Course not found
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error: "No course with the id of `courseId` was found!"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error: "Internal Server Error!"
 */

/**
 * @swagger
 * /api/v1/courses/{courseId}:
 *   put:
 *     summary: Update a course
 *     description: Update an existing course (requires authentication and publisher/admin role)
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the course to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the course
 *                 example: "Front End Web Development"
 *               description:
 *                 type: string
 *                 description: Detailed description of the course
 *               weeks:
 *                 type: string
 *                 description: Duration of the course in weeks
 *                 example: "8"
 *               tuition:
 *                 type: number
 *                 description: Cost of the course
 *                 example: 13000
 *               minimumSkill:
 *                 type: string
 *                 enum: [beginner, intermediate, advanced]
 *                 description: Minimum skill level required
 *                 example: "advanced"
 *               scholarshipAvailable:
 *                 type: boolean
 *                 description: Whether scholarships are available
 *     responses:
 *       200:
 *         description: Course updated successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 _id: "5d725a4a7b292f5f8ceff789"
 *                 title: "Front End Web Development"
 *                 description: "This course will provide you with all of the essentials to become a successful frontend web developer..."
 *                 weeks: "8"
 *                 tuition: 13000
 *                 minimumSkill: "advanced"
 *                 scholarshipAvailable: false
 *                 bootcamp: "5d713995b721c3bb38c1f5d0"
 *                 user: "5d7a514b5d2c12c7449be045"
 *                 createdAt: "2025-05-15T07:27:14.466Z"
 *                 __v: 0
 *       400:
 *         description: Bad request - Invalid input data
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error: "Please add a title"
 *       401:
 *         description: Unauthorized - Authentication required
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error: "Not authenticated to access this resource!"
 *       403:
 *         description: Forbidden - User is not authorized to update this course
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error: "User is not authorized to update this course!"
 *       404:
 *         description: Course not found
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error: "No course with the id of `courseId` was found!"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error: "Internal Server Error!"
 */

/**
 * @swagger
 * /api/v1/courses/{courseId}:
 *   delete:
 *     summary: Delete a course
 *     description: Delete an existing course (requires authentication and publisher/admin role)
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the course to delete
 *     responses:
 *       200:
 *         description: Course deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data: {}
 *       401:
 *         description: Unauthorized - Authentication required
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error: "Not authenticated to access this resource!"
 *       403:
 *         description: Forbidden - User is not authorized to delete this course
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error: "User is not authorized to delete this course!"
 *       404:
 *         description: Course not found
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error: "No course with the id of `courseId` was found!"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error: "Internal Server Error!"
 */

router
  .route("/")
  .get(
    advancedResults(Course, {
      path: "bootcamp",
      select: "name description",
    }),
    getCourses,
  )
  .post(protectRoute, authorizeRole("publisher", "admin"), createCourse);
router
  .route("/:courseId")
  .get(getCourse)
  .put(protectRoute, authorizeRole("publisher", "admin"), updateCourse)
  .delete(protectRoute, authorizeRole("publisher", "admin"), deleteCourse);

export default router;
