import Review from "../models/ReviewModel.js";
import Bootcamp from "../models/BootcampModel.js";
import asyncHandler from "../middlewares/asyncMiddleware.js";
import ErrorResponse from "../utils/ErrorResponse.js";

/**
 * @desc    Get reviews
 * @route   GET /api/v1/reviews
 * @route   GET /api/v1/bootcamps/:bootcampId/reviews
 * @access  Public
 */
export const getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const reviews = await Review.find({ bootcamp: req.params.bootcampId });

    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

/**
 * @desc    Get a single review
 * @route   GET /api/v1/reviews/:reviewId
 * @access  Public
 */
export const getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.reviewId).populate({
    path: "bootcamp",
    select: "name description",
  });

  if (!review) {
    return next(
      new ErrorResponse(
        `No review found with the id of ${req.params.reviewId}`,
        404
      )
    );
  }

  res.status(200).json({
    success: true,
    data: review,
  });
});

/**
 * @desc    Create a review
 * @route   POST /api/v1/bootcamps/:bootcampId/reviews
 * @access  Private
 */
export const createReview = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `No bootcamp found with the id of ${req.params.bootcampId}`,
        404
      )
    );
  }

  const review = await Review.create(req.body);

  res.status(201).json({
    success: true,
    data: review,
  });
});

/**
 * @desc    Update review
 * @route   PUT /api/v1/reviews/:reviewId
 * @access  Private
 */
export const updateReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.reviewId);

  if (!review) {
    return next(
      new ErrorResponse(
        `No review found with the id of ${req.params.reviewId}`,
        404
      )
    );
  }

  // Make sure review belongs to user or user is admin
  if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse("Not authorized to update the review!", 401));
  }

  const updatedReview = await Review.findByIdAndUpdate(
    req.params.reviewId,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    success: true,
    data: updatedReview,
  });
});

/**
 * @desc    Delete review
 * @route   DELETE /api/v1/reviews/:reviewId
 * @access  Private
 */
export const deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.reviewId);

  if (!review) {
    return next(
      new ErrorResponse(
        `No review found with the id of ${req.params.reviewId}`,
        404
      )
    );
  }

  // Make sure review belongs to user or user is admin
  if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse("Not authorized to update the review!", 401));
  }

  await review.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});
