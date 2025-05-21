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

/**
 * @swagger
 * /api/v1/bootcamps/radius/{zipcode}/{distance}:
 *  get:
 *    summary: Get bootcamps within a specified radius.
 *    tags: [Bootcamps]
 *    description: Get all bootcamps within a specified distance from a given zipcode
 *    parameters:
 *      - in: path
 *        name: zipcode
 *        required: true
 *        schema:
 *          type: string
 *        description: The zipcode to search from
 *      - in: path
 *        name: distance
 *        required: true
 *        schema:
 *          type: integer
 *        description: Distance in miles from the zipcode
 *    responses:
 *      200:
 *        description: Bootcamps found within radius
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
 *                  example: 2
 *                data:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      location:
 *                        type: object
 *                        properties:
 *                          type:
 *                            type: string
 *                            example: "Point"
 *                          coordinates:
 *                            type: array
 *                            items:
 *                              type: number
 *                            example: [-71.3232, 42.64981]
 *                          formattedAddress:
 *                            type: string
 *                            example: "220 Pawtucket St, Lowell, MA 01854-3558, US"
 *                          street:
 *                            type: string
 *                            example: "220 Pawtucket St"
 *                          city:
 *                            type: string
 *                            example: "Lowell"
 *                          state:
 *                            type: string
 *                            example: "MA"
 *                          zipcode:
 *                            type: string
 *                            example: "01854-3558"
 *                          country:
 *                            type: string
 *                            example: "US"
 *                      _id:
 *                        type: string
 *                      name:
 *                        type: string
 *                      description:
 *                        type: string
 *                      website:
 *                        type: string
 *                      phone:
 *                        type: string
 *                      email:
 *                        type: string
 *                      careers:
 *                        type: array
 *                        items:
 *                          type: string
 *                      photo:
 *                        type: string
 *                      housing:
 *                        type: boolean
 *                      jobAssistance:
 *                        type: boolean
 *                      jobGuarantee:
 *                        type: boolean
 *                      acceptGi:
 *                        type: boolean
 *                      user:
 *                        type: string
 *                      createdAt:
 *                        type: string
 *                        format: date-time
 *                      slug:
 *                        type: string
 *                      __v:
 *                        type: integer
 *                      averageCost:
 *                        type: integer
 *                      id:
 *                        type: string
 *      400:
 *        description: Invalid parameters
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
 *                  description: Error message
 *                  example: "Invalid zipcode or distance"
 *        x-error: true
 *      500:
 *        description: Internal Server Error
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
 *                  description: Error message
 *                  example: "Internal Server Error!"
 *        x-error: true
 */

router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);

/**
 * @swagger
 * /api/v1/bootcamps/{bootcampId}/photo:
 *  put:
 *    summary: Upload bootcamp photo
 *    tags: [Bootcamps]
 *    description: Upload a photo for the bootcamp.
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: bootcampId
 *        required: true
 *        schema:
 *          type: string
 *        description: ID of the bootcamp to update photo for
 *    requestBody:
 *      content:
 *        multipart/form-data:
 *          schema:
 *            type: object
 *            properties:
 *              file:
 *                type: string
 *                format: binary
 *                description: The photo file to upload
 *    responses:
 *      200:
 *        description: Photo uploaded successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  example: true
 *                data:
 *                  type: object
 *                  properties:
 *                    photo:
 *                      type: string
 *                      description: URL or path to the uploaded photo
 *      400:
 *        description: Bad request - Invalid file format or size
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
 *                  description: Error message
 *                  example: "Please upload a image file for the bootcamp less than 1 mb!"
 *        x-error: true
 *      401:
 *        description: Unauthorized - User must be logged in and have publisher or admin role
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
 *                  description: Error message
 *                  example: "Not authorized to access this route!"
 *        x-error: true
 *      403:
 *        description: Forbidden - User is not the owner of the bootcamp
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
 *                  description: Error message
 *                  example: "User is not authorized to update this bootcamp!"
 *        x-error: true
 *      404:
 *        description: Bootcamp not found
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
 *                  description: Error message
 *                  example: "No bootcamp with ID `bootcampId` was found!"
 *        x-error: true
 *      500:
 *        description: Internal Server Error
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
 *                  description: Error message
 *                  example: "Internal Server Error!"
 *        x-error: true
 */

router
  .route("/:bootcampId/photo")
  .put(protectRoute, authorizeRole("publisher", "admin"), uploadBootcampPhoto);
/**
 * @swagger
 * /api/v1/bootcamps:
 *  get:
 *    summary: Get all bootcamps
 *    tags: [Bootcamps]
 *    description: Get all bootcamps with pagination and filtering options
 *    parameters:
 *      - in: query
 *        name: field
 *        schema:
 *          type: string
 *        description: Filter bootcamps by field value
 *        example: name=Devcentral
 *      - in: query
 *        name: field[gt]
 *        schema:
 *          type: string
 *        description: Filter bootcamps where field is greater than the specified value
 *        example: averageCost[gt]=5000
 *      - in: query
 *        name: field[lt]
 *        schema:
 *          type: string
 *        description: Filter bootcamps where field is less than the specified value
 *        example: averageCost[lt]=10000
 *      - in: query
 *        name: select
 *        schema:
 *          type: string
 *        description: Select specific fields to return (comma-separated)
 *        example: name,description,averageCost
 *      - in: query
 *        name: sort
 *        schema:
 *          type: string
 *        description: Sort results by specified fields (prefix with - for descending)
 *        example: name,-averageCost
 *      - in: query
 *        name: page
 *        schema:
 *          type: integer
 *          default: 1
 *        description: Page number for pagination
 *        example: 2
 *      - in: query
 *        name: limit
 *        schema:
 *          type: integer
 *          default: 10
 *        description: Number of items per page
 *        example: 10
 *    responses:
 *      200:
 *        description: Successfully retrieved bootcamps
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
 *                  example: 4
 *                pagination:
 *                  type: object
 *                  properties:
 *                    page:
 *                      type: integer
 *                      example: 2
 *                    limit:
 *                      type: integer
 *                      example: 10
 *                    total:
 *                      type: integer
 *                      example: 4
 *                    totalPages:
 *                      type: integer
 *                      example: 1
 *                data:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      location:
 *                        type: object
 *                        properties:
 *                          type:
 *                            type: string
 *                            example: "Point"
 *                          coordinates:
 *                            type: array
 *                            items:
 *                              type: number
 *                            example: [-71.52588, 41.48372]
 *                          formattedAddress:
 *                            type: string
 *                            example: "45 Upper College Rd, Kingston, RI 02881-2003, US"
 *                          street:
 *                            type: string
 *                            example: "45 Upper College Rd"
 *                          city:
 *                            type: string
 *                            example: "Kingston"
 *                          state:
 *                            type: string
 *                            example: "RI"
 *                          zipcode:
 *                            type: string
 *                            example: "02881-2003"
 *                          country:
 *                            type: string
 *                            example: "US"
 *                      _id:
 *                        type: string
 *                        example: "5d725a1b7b292f5f8ceff788"
 *                      name:
 *                        type: string
 *                        example: "Devcentral Bootcamp"
 *                      description:
 *                        type: string
 *                        example: "Is coding your passion? Codemasters will give you the skills and the tools to become the best developer possible."
 *                      website:
 *                        type: string
 *                        example: "https://devcentral.com"
 *                      phone:
 *                        type: string
 *                        example: "(444) 444-4444"
 *                      email:
 *                        type: string
 *                        example: "enroll@devcentral.com"
 *                      careers:
 *                        type: array
 *                        items:
 *                          type: string
 *                        example: ["Mobile Development", "Web Development"]
 *                      photo:
 *                        type: string
 *                        example: "no-photo.jpg"
 *                      housing:
 *                        type: boolean
 *                        example: false
 *                      jobAssistance:
 *                        type: boolean
 *                        example: true
 *                      jobGuarantee:
 *                        type: boolean
 *                        example: true
 *                      acceptGi:
 *                        type: boolean
 *                        example: true
 *                      user:
 *                        type: string
 *                        example: "5c8a1d5b0190b214360dc032"
 *                      createdAt:
 *                        type: string
 *                        format: date-time
 *                        example: "2025-05-15T07:27:12.396Z"
 *                      slug:
 *                        type: string
 *                        example: "devcentral-bootcamp"
 *                      __v:
 *                        type: integer
 *                        example: 0
 *                      averageCost:
 *                        type: integer
 *                        example: 6340
 *                      averageRating:
 *                        type: number
 *                        example: 9
 *                      courses:
 *                        type: array
 *                        items:
 *                          type: object
 *                          properties:
 *                            _id:
 *                              type: string
 *                              example: "5d725cfec4ded7bcb480eaa5"
 *                            title:
 *                              type: string
 *                              example: "Web Development"
 *                            description:
 *                              type: string
 *                              example: "This course will teach you how to build high quality web applications"
 *                            weeks:
 *                              type: string
 *                              example: "8"
 *                            tuition:
 *                              type: integer
 *                              example: 8000
 *                            minimumSkill:
 *                              type: string
 *                              enum: ["beginner", "intermediate", "advanced"]
 *                              example: "beginner"
 *                            scholarshipAvailable:
 *                              type: boolean
 *                              example: false
 *                            bootcamp:
 *                              type: string
 *                              example: "5d725a1b7b292f5f8ceff788"
 *                            user:
 *                              type: string
 *                              example: "5c8a1d5b0190b214360dc032"
 *                            createdAt:
 *                              type: string
 *                              format: date-time
 *                              example: "2025-05-15T07:27:14.467Z"
 *                            __v:
 *                              type: integer
 *                              example: 0
 *                      id:
 *                        type: string
 *                        example: "5d725a1b7b292f5f8ceff788"
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
 *                  description: Error message indicating invalid query parameters
 *                  example: "Invalid query parameters"
 *        x-error: true
 *      500:
 *        description: Internal Server Error
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
 *                  description: Error message indicating internal server error
 *                  example: "Internal Server Error!"
 *        x-error: true
 *  post:
 *    summary: Create a new bootcamp
 *    tags: [Bootcamps]
 *    description: Create a new bootcamp with the provided information
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - name
 *              - description
 *              - website
 *              - phone
 *              - email
 *              - address
 *              - careers
 *              - housing
 *              - jobAssistance
 *              - jobGuarantee
 *              - acceptGi
 *            properties:
 *              name:
 *                type: string
 *                description: Name of the bootcamp (must be unique)
 *                example: "ModernTech Bootcamp"
 *              description:
 *                type: string
 *                description: Detailed description of the bootcamp (must be unique)
 *                example: "ModernTech has one goal, and that is to make you a rockstar developer and/or designer with a six figure salary. We teach both development and UI/UX"
 *              website:
 *                type: string
 *                format: uri
 *                description: Website URL of the bootcamp
 *                example: "https://moderntech.com"
 *              phone:
 *                type: string
 *                description: Contact phone number
 *                example: "(222) 222-2222"
 *              email:
 *                type: string
 *                format: email
 *                description: Contact email address
 *                example: "enroll@moderntech.com"
 *              address:
 *                type: string
 *                description: Physical address that will be geocoded
 *                example: "220 Pawtucket St, Lowell, MA 01854"
 *              careers:
 *                type: array
 *                items:
 *                  type: string
 *                description: List of career paths offered
 *                example: ["Web Development", "UI/UX", "Mobile Development"]
 *              housing:
 *                type: boolean
 *                description: Whether housing is provided
 *                example: false
 *              jobAssistance:
 *                type: boolean
 *                description: Whether job assistance is provided
 *                example: true
 *              jobGuarantee:
 *                type: boolean
 *                description: Whether job guarantee is provided
 *                example: false
 *              acceptGi:
 *                type: boolean
 *                description: Whether GI Bill is accepted
 *                example: true
 *    responses:
 *      201:
 *        description: Bootcamp created successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  example: true
 *                data:
 *                  type: object
 *                  properties:
 *                    name:
 *                      type: string
 *                      example: "ModernTech Bootcamp"
 *                    description:
 *                      type: string
 *                      example: "ModernTech has one goal, and that is to make you a rockstar developer and/or designer with a six figure salary. We teach both development and UI/UX"
 *                    website:
 *                      type: string
 *                      example: "https://moderntech.com"
 *                    phone:
 *                      type: string
 *                      example: "(222) 222-2222"
 *                    email:
 *                      type: string
 *                      example: "enroll@moderntech.com"
 *                    location:
 *                      type: object
 *                      properties:
 *                        type:
 *                          type: string
 *                          example: "Point"
 *                        coordinates:
 *                          type: array
 *                          items:
 *                            type: number
 *                          example: [-71.3232, 42.64981]
 *                        formattedAddress:
 *                          type: string
 *                          example: "220 Pawtucket St, Lowell, MA 01854-3558, US"
 *                        street:
 *                          type: string
 *                          example: "220 Pawtucket St"
 *                        city:
 *                          type: string
 *                          example: "Lowell"
 *                        state:
 *                          type: string
 *                          example: "MA"
 *                        zipcode:
 *                          type: string
 *                          example: "01854-3558"
 *                        country:
 *                          type: string
 *                          example: "US"
 *                    careers:
 *                      type: array
 *                      items:
 *                        type: string
 *                      example: ["Web Development", "UI/UX", "Mobile Development"]
 *                    photo:
 *                      type: string
 *                      example: "no-photo.jpg"
 *                    housing:
 *                      type: boolean
 *                      example: false
 *                    jobAssistance:
 *                      type: boolean
 *                      example: true
 *                    jobGuarantee:
 *                      type: boolean
 *                      example: false
 *                    acceptGi:
 *                      type: boolean
 *                      example: true
 *                    user:
 *                      type: string
 *                      example: "5d7a514b5d2c12c7449be045"
 *                    _id:
 *                      type: string
 *                      example: "682dfb17f89c16f97a1eca52"
 *                    createdAt:
 *                      type: string
 *                      format: date-time
 *                      example: "2025-05-21T16:11:03.924Z"
 *                    slug:
 *                      type: string
 *                      example: "moderntech-bootcamp-one"
 *                    __v:
 *                      type: integer
 *                      example: 0
 *                    id:
 *                      type: string
 *                      example: "682dfb17f89c16f97a1eca52"
 *      400:
 *        description: Validation error or duplicate bootcamp
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
 *                  description: Error message
 *                  example: "The user with ID 5d7a514b5d2c12c7449be045 has already published a bootcamp!"
 *        x-error: true
 *      401:
 *        description: Unauthorized - User must be logged in
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
 *                  description: Error message
 *                  example: "Not authorized to access this route"
 *        x-error: true
 *      409:
 *        description: Duplicate name or description
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
 *                  description: Error message
 *                  example: "Duplicate field value entered!"
 *        x-error: true
 *      500:
 *        description: Internal Server Error
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
 *                  description: Error message
 *                  example: "Internal Server Error!"
 *        x-error: true
 */

router
  .route("/")
  .get(advancedResults(Bootcamp, "courses"), getBootcamps)
  .post(protectRoute, authorizeRole("publisher", "admin"), createBootcamp);
/**
 * @swagger
 * /api/v1/bootcamps/{bootcampId}:
 *  get:
 *    summary: Get a single bootcamp by ID
 *    tags: [Bootcamps]
 *    description: Get single bootcamp by bootcampId.
 *    parameters:
 *      - in: path
 *        name: bootcampId
 *        required: true
 *        schema:
 *          type: string
 *        description: ID of the bootcamp to retrieve
 *    responses:
 *      200:
 *        description: Bootcamp retrieved successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  example: true
 *                data:
 *                  type: object
 *                  properties:
 *                    location:
 *                      type: object
 *                      properties:
 *                        type:
 *                          type: string
 *                          example: "Point"
 *                        coordinates:
 *                          type: array
 *                          items:
 *                            type: number
 *                          example: [-71.3232, 42.64981]
 *                        formattedAddress:
 *                          type: string
 *                          example: "220 Pawtucket St, Lowell, MA 01854-3558, US"
 *                        street:
 *                          type: string
 *                          example: "220 Pawtucket St"
 *                        city:
 *                          type: string
 *                          example: "Lowell"
 *                        state:
 *                          type: string
 *                          example: "MA"
 *                        zipcode:
 *                          type: string
 *                          example: "01854-3558"
 *                        country:
 *                          type: string
 *                          example: "US"
 *                    _id:
 *                      type: string
 *                      example: "682dfb17f89c16f97a1eca52"
 *                    name:
 *                      type: string
 *                      example: "ModernTech Bootcamp One"
 *                    description:
 *                      type: string
 *                      example: "ModernTech has one goal, and that is to make you a rockstar developer and/or designer with a six figure salary. We teach both development and UI/UX"
 *                    website:
 *                      type: string
 *                      example: "https://moderntech.com"
 *                    phone:
 *                      type: string
 *                      example: "(222) 222-2222"
 *                    email:
 *                      type: string
 *                      example: "enroll@moderntech.com"
 *                    careers:
 *                      type: array
 *                      items:
 *                        type: string
 *                      example: ["Web Development", "UI/UX", "Mobile Development"]
 *                    photo:
 *                      type: string
 *                      example: "no-photo.jpg"
 *                    housing:
 *                      type: boolean
 *                      example: false
 *                    jobAssistance:
 *                      type: boolean
 *                      example: true
 *                    jobGuarantee:
 *                      type: boolean
 *                      example: false
 *                    acceptGi:
 *                      type: boolean
 *                      example: true
 *                    user:
 *                      type: string
 *                      example: "5d7a514b5d2c12c7449be045"
 *                    createdAt:
 *                      type: string
 *                      format: date-time
 *                      example: "2025-05-21T16:11:03.924Z"
 *                    slug:
 *                      type: string
 *                      example: "moderntech-bootcamp-one"
 *                    __v:
 *                      type: integer
 *                      example: 0
 *                    id:
 *                      type: string
 *                      example: "682dfb17f89c16f97a1eca52"
 *      404:
 *        description: Bootcamp not found
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
 *                  description: Error message
 *                  example: "No bootcamp with ID `bootcampId` was found!"
 *        x-error: true
 *      500:
 *        description: Internal Server Error
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
 *                  description: Error message
 *                  example: "Internal Server Error!"
 *        x-error: true
 *  put:
 *    summary: Update a bootcamp
 *    tags: [Bootcamps]
 *    description: Update bootcamp information by ID
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: bootcampId
 *        required: true
 *        schema:
 *          type: string
 *        description: ID of the bootcamp to update
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                description: Name of the bootcamp
 *              description:
 *                type: string
 *                description: Detailed description of the bootcamp
 *              website:
 *                type: string
 *                description: Website URL of the bootcamp
 *              phone:
 *                type: string
 *                description: Contact phone number
 *              email:
 *                type: string
 *                description: Contact email address
 *              careers:
 *                type: array
 *                items:
 *                  type: string
 *                description: List of career paths offered
 *              housing:
 *                type: boolean
 *                description: Whether housing is provided
 *              jobAssistance:
 *                type: boolean
 *                description: Whether job assistance is provided
 *              jobGuarantee:
 *                type: boolean
 *                description: Whether job guarantee is provided
 *              acceptGi:
 *                type: boolean
 *                description: Whether GI Bill is accepted
 *    responses:
 *      200:
 *        description: Bootcamp updated successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  example: true
 *                data:
 *                  type: object
 *                  properties:
 *                    location:
 *                      type: object
 *                      properties:
 *                        type:
 *                          type: string
 *                          example: "Point"
 *                        coordinates:
 *                          type: array
 *                          items:
 *                            type: number
 *                          example: [-71.3232, 42.64981]
 *                        formattedAddress:
 *                          type: string
 *                          example: "220 Pawtucket St, Lowell, MA 01854-3558, US"
 *                        street:
 *                          type: string
 *                          example: "220 Pawtucket St"
 *                        city:
 *                          type: string
 *                          example: "Lowell"
 *                        state:
 *                          type: string
 *                          example: "MA"
 *                        zipcode:
 *                          type: string
 *                          example: "01854-3558"
 *                        country:
 *                          type: string
 *                          example: "US"
 *                    _id:
 *                      type: string
 *                      example: "682dfb17f89c16f97a1eca52"
 *                    name:
 *                      type: string
 *                      example: "ModernTech Bootcamp One"
 *                    description:
 *                      type: string
 *                      example: "ModernTech has one goal, and that is to make you a rockstar developer and/or designer with a six figure salary. We teach both development and UI/UX"
 *                    website:
 *                      type: string
 *                      example: "[https://moderntech.com](https://moderntech.com)"
 *                    phone:
 *                      type: string
 *                      example: "(222) 222-2222"
 *                    email:
 *                      type: string
 *                      example: "enroll@moderntech.com"
 *                    careers:
 *                      type: array
 *                      items:
 *                        type: string
 *                      example: ["Web Development", "UI/UX", "Mobile Development"]
 *                    photo:
 *                      type: string
 *                      example: "no-photo.jpg"
 *                    housing:
 *                      type: boolean
 *                      example: true
 *                    jobAssistance:
 *                      type: boolean
 *                      example: true
 *                    jobGuarantee:
 *                      type: boolean
 *                      example: false
 *                    acceptGi:
 *                      type: boolean
 *                      example: true
 *                    user:
 *                      type: string
 *                      example: "5d7a514b5d2c12c7449be045"
 *                    createdAt:
 *                      type: string
 *                      format: date-time
 *                      example: "2025-05-21T16:11:03.924Z"
 *                    slug:
 *                      type: string
 *                      example: "moderntech-bootcamp-one"
 *                    __v:
 *                      type: integer
 *                      example: 0
 *                    id:
 *                      type: string
 *                      example: "682dfb17f89c16f97a1eca52"
 *      400:
 *        description: Validation error
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
 *                  description: Error message
 *                  example: "Validation error occurred"
 *        x-error: true
 *      401:
 *        description: Unauthorized - User must be logged in and have publisher or admin role
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
 *                  description: Error message
 *                  example: "Not authorized to access this route!"
 *        x-error: true
 *      403:
 *        description: Forbidden - User is not the owner of the bootcamp
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
 *                  description: Error message
 *                  example: "User is not authorized to update this bootcamp!"
 *        x-error: true
 *      404:
 *        description: Bootcamp not found
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
 *                  description: Error message
 *                  example: "No bootcamp with ID `bootcampId` was found!"
 *        x-error: true
 *      500:
 *        description: Internal Server Error
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
 *                  description: Error message
 *                  example: "Internal Server Error!"
 *        x-error: true
 *  delete:
 *    summary: Delete a bootcamp
 *    tags: [Bootcamps]
 *    description: Delete a bootcamp by ID
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: bootcampId
 *        required: true
 *        schema:
 *          type: string
 *        description: ID of the bootcamp to delete
 *    responses:
 *      200:
 *        description: Bootcamp deleted successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  example: true
 *                data:
 *                  type: object
 *                  example: {}
 *      401:
 *        description: Unauthorized - User must be logged in and have publisher or admin role
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
 *                  description: Error message
 *                  example: "Not authorized to access this route!"
 *        x-error: true
 *      403:
 *        description: Forbidden - User is not the owner of the bootcamp
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
 *                  description: Error message
 *                  example: "User is not authorized to delete this bootcamp!"
 *        x-error: true
 *      404:
 *        description: Bootcamp not found
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
 *                  description: Error message
 *                  example: "No bootcamp with ID `bootcampId` was found!"
 *        x-error: true
 *      500:
 *        description: Internal Server Error
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
 *                  description: Error message
 *                  example: "Internal Server Error!"
 *        x-error: true
 */

router
  .route("/:bootcampId")
  .get(getBootcamp)
  .put(protectRoute, authorizeRole("publisher", "admin"), updateBootcamp)
  .delete(protectRoute, authorizeRole("publisher", "admin"), deleteBootcamp);

export default router;
