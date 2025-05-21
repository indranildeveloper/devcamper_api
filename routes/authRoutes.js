import express from "express";
import {
  registerUser,
  loginUser,
  getCurrentUser,
  forgotPassword,
  resetPassword,
  updateDetails,
  updatePassword,
  logoutUser,
} from "../controllers/authController.js";
import protectRoute from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/auth/register:
 *  post:
 *    summary: Register user
 *    tags: [Authentication]
 *    description: Add user to the database with encrypted password and send JWT authentication token in http-only cookie.
 *    responses:
 *      200:
 *        description: User registered successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  example: true
 *                token:
 *                  type: string
 *                  description: JWT authentication token
 *                  example: jwt token
 *      409:
 *        description: Conflict error - duplicate field value
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
 *                  description: Error message indicating duplicate field
 *                  example: Duplicate field value entered!
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
 *                  example: Internal Server Error!
 *        x-error: true
 *    headers:
 *      Content-Type:  application/json
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - name
 *              - email
 *              - password
 *              - role
 *            properties:
 *              name:
 *                type: string
 *                description: User's full name
 *                example: John Doe
 *              email:
 *                type: string
 *                format: email
 *                description: User's email address
 *                example: john@gmail.com
 *              password:
 *                type: string
 *                format: password
 *                description: User's password
 *                example: 123456
 *              role:
 *                type: string
 *                enum: [user, admin]
 *                description: User's role
 *                example: user
 */
router.route("/register").post(registerUser);
/**
 * @swagger
 * /api/v1/auth/login:
 *  post:
 *    summary: Login user
 *    tags: [Authentication]
 *    description: Authenticate user and return JWT token with password and email and send JWT authentication token in http-only cookie.
 *    responses:
 *      200:
 *        description: User logged in successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  example: true
 *                token:
 *                  type: string
 *                  description: JWT authentication token
 *                  example: jwt token
 *      401:
 *        description: Unauthorized - Invalid credentials
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
 *                  description: Error message indicating invalid credentials
 *                  example: Invalid credentials!
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
 *                  example: Internal Server Error!
 *        x-error: true
 *    headers:
 *      Content-Type:  application/json
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - email
 *              - password
 *            properties:
 *              email:
 *                type: string
 *                format: email
 *                description: User's email address
 *                example: john@gmail.com
 *              password:
 *                type: string
 *                format: password
 *                description: User's password
 *                example: 123456
 */
router.route("/login").post(loginUser);
/**
 * @swagger
 * /api/v1/auth/logout:
 *  post:
 *    summary: Logout user
 *    tags: [Authentication]
 *    description: Logout user and clear the cookie from the server.
 *    responses:
 *      200:
 *        description: User logged in successfully
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
 *                  description: Empty user data
 *                  example: {}
 *      401:
 *        description: Unauthorized - Invalid credentials
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
 *                  description: Error message indicating invalid credentials
 *                  example: Invalid credentials!
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
 *                  example: Internal Server Error!
 *        x-error: true
 *    headers:
 *      Content-Type:  application/json
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - email
 *              - password
 *            properties:
 *              email:
 *                type: string
 *                format: email
 *                description: User's email address
 *                example: john@gmail.com
 *              password:
 *                type: string
 *                format: password
 *                description: User's password
 *                example: 123456
 */
router.route("/logout").get(logoutUser);
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       in: header
 *       name: Authorization
 *
 * /api/v1/auth/currentUser:
 *  get:
 *    summary: Get Current Logged In User
 *    tags: [Authentication]
 *    description: Get the current logged in user via authorization token.
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: Current user data retrieved successfully
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
 *                  description: User data
 *                  properties:
 *                    _id:
 *                      type: string
 *                      description: User's unique identifier
 *                      example: 5d7a514b5d2c12c7449be045
 *                    name:
 *                      type: string
 *                      description: User's full name
 *                      example: John Doe
 *                    email:
 *                      type: string
 *                      format: email
 *                      description: User's email address
 *                      example: john@gmail.com
 *                    role:
 *                      type: string
 *                      enum: [user, admin, publisher]
 *                      description: User's role
 *                      example: publisher
 *                    createdAt:
 *                      type: string
 *                      format: date-time
 *                      description: Timestamp when user was created
 *                      example: 2025-05-15T07:27:14.484Z
 *                    __v:
 *                      type: integer
 *                      description: MongoDB version number
 *                      example: 0
 *      401:
 *        description: Unauthorized - Invalid credentials
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
 *                  description: Error message indicating invalid credentials
 *                  example: Not authorized to access this resource!
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
 *                  example: Internal Server Error!
 *        x-error: true
 *
 *    headers:
 *      Content-Type:  application/json
 *      Authorization:
 *        description: Bearer token
 *        schema:
 *          type: string
 *          example: Bearer your-jwt-token-here
 */
router.route("/currentUser").get(protectRoute, getCurrentUser);
/**
 * @swagger
 * /api/v1/auth/updatedetails:
 *  put:
 *    summary: Update user details
 *    tags: [Authentication]
 *    description: Update user details such as name and email.
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: User details updated successfully
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
 *                    _id:
 *                      type: string
 *                      example: "5d7a514b5d2c12c7449be045"
 *                    name:
 *                      type: string
 *                      example: "John Doe One"
 *                    email:
 *                      type: string
 *                      example: "john@gmail.com"
 *                    role:
 *                      type: string
 *                      example: "publisher"
 *                    createdAt:
 *                      type: string
 *                      format: date-time
 *                      example: "2025-05-15T07:27:14.484Z"
 *                    __v:
 *                      type: integer
 *                      example: 0
 *      401:
 *        description: Unauthorized - Invalid credentials
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
 *                  description: Error message indicating invalid credentials
 *                  example: Not authorized to access this resource!
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
 *                  example: Internal Server Error!
 *        x-error: true
 *    headers:
 *      Content-Type:  application/json
 *      Authorization:
 *        description: Bearer token
 *        schema:
 *          type: string
 *          example: Bearer your-jwt-token-here
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                description: User's full name
 *                example: John Doe One
 *              email:
 *                type: string
 *                format: email
 *                description: User's email address
 *                example: john@gmail.com
 */
router.route("/updatedetails").put(protectRoute, updateDetails);
/**
 * @swagger
 * /api/v1/auth/updatepassword:
 *  put:
 *    summary: Update user password
 *    tags: [Authentication]
 *    description: Update user password.
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: User password updated successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  example: true
 *                token:
 *                  type: string
 *                  description: JWT authentication token
 *                  example: jwt token
 *      401:
 *        description: Unauthorized - Invalid credentials
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
 *                  description: Error message indicating invalid credentials
 *                  example: Current password is incorrect
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
 *                  example: Internal Server Error!
 *        x-error: true
 *    headers:
 *      Content-Type:  application/json
 *      Authorization:
 *        description: Bearer token
 *        schema:
 *          type: string
 *          example: Bearer your-jwt-token-here
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - currentPassword
 *              - newPassword
 *            properties:
 *              currentPassword:
 *                type: string
 *                description: User's current password
 *                example: "1234567"
 *              newPassword:
 *                type: string
 *                description: User's new password
 *                example: "12345678"
 */
router.route("/updatepassword").put(protectRoute, updatePassword);
/**
 * @swagger
 * /api/v1/auth/forgotpassword:
 *  post:
 *    summary: Send password reset email
 *    tags: [Authentication]
 *    description: Generate password token and send a password reset email to the user's registered email address.
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - email
 *            properties:
 *              email:
 *                type: string
 *                format: email
 *                description: User's registered email address
 *                example: "john@gmail.com"
 *    responses:
 *      200:
 *        description: Password reset email sent successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  example: true
 *                data:
 *                  type: string
 *                  example: "Email Sent!"
 *      404:
 *        description: User not found
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
 *                  description: Error message indicating user not found
 *                  example: "There is no user with that email!"
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
 */
router.route("/forgotpassword").post(forgotPassword);
/**
 * @swagger
 * /api/v1/auth/resetpassword/{resetToken}:
 *  put:
 *    summary: Reset user password using reset token
 *    tags: [Authentication]
 *    description: Reset user password using the provided reset token from the password reset email.
 *    parameters:
 *      - in: path
 *        name: resetToken
 *        schema:
 *          type: string
 *        required: true
 *        description: The password reset token received via email
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - password
 *            properties:
 *              password:
 *                type: string
 *                description: New password for the user
 *                example: "1234567"
 *    responses:
 *      200:
 *        description: Password reset successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  example: true
 *                token:
 *                  type: string
 *                  description: JWT authentication token
 *                  example: "JWT token"
 *      400:
 *        description: Invalid reset token or password reset failed
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
 *                  description: Error message indicating invalid token or password reset failure
 *                  example: "Invalid or expired token!"
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
 */
router.route("/resetpassword/:resetToken").put(resetPassword);

export default router;
