import Course from "../models/CourseModel.js";
import Bootcamp from "../models/BootcampModel.js";
import asyncHandler from "../middlewares/asyncMiddleware.js";
import ErrorResponse from "../utils/ErrorResponse.js";

/**
 * @desc    Get courses
 * @route   GET /api/v1/courses
 * @route   GET /api/v1/bootcamps/:bootcampId/courses
 * @access  Public
 */
export const getCourses = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const courses = await Course.find({ bootcamp: req.params.bootcampId });

    return res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

/**
 * @desc    Get a single courses
 * @route   GET /api/v1/courses/:courseId
 * @access  Public
 */
export const getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.courseId).populate({
    path: "bootcamp",
    select: "name description",
  });

  if (!course) {
    return next(
      new ErrorResponse(
        `No course with the id of ${req.params.courseId} found!`
      ),
      404
    );
  }

  res.status(200).json({
    success: true,
    data: course,
  });
});

/**
 * @desc    Create a course
 * @route   POST /api/v1/bootcamps/:bootcampId/courses
 * @access  Private
 */
export const createCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `No bootcamp with the id of ${req.params.bootcampId} found!`
      ),
      404
    );
  }

  const course = await Course.create(req.body);

  res.status(201).json({
    success: true,
    data: course,
  });
});

/**
 * @desc    Update a course
 * @route   PUT /api/v1/courses/:courseId
 * @access  Private
 */
export const updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.courseId);

  if (!course) {
    return next(
      new ErrorResponse(
        `No course with the id of ${req.params.courseId} found!`
      ),
      404
    );
  }

  course = await Course.findByIdAndUpdate(req.params.courseId, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: course,
  });
});

/**
 * @desc    Delete a course
 * @route   DELETE /api/v1/courses/:courseId
 * @access  Private
 */
export const deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.courseId);

  if (!course) {
    return next(
      new ErrorResponse(
        `No course with the id of ${req.params.courseId} found!`
      ),
      404
    );
  }

  await course.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});
