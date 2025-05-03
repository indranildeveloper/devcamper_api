import Bootcamp from "../models/BootcampModel.js";

/**
 * @desc    Get all bootcamps
 * @route   GET /api/v1/bootcamps
 * @access  Public
 */
export const getBootcamps = async (req, res, next) => {
  try {
    const bootcamps = await Bootcamp.find();
    res.status(200).json({
      success: true,
      data: bootcamps,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
    });
  }
};

/**
 * @desc    Get single bootcamps
 * @route   GET /api/v1/bootcamps/:bootcampId
 * @access  Public
 */
export const getBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.bootcampId);

    if (!bootcamp) {
      return res.status(400).json({ success: false });
    }

    res.status(200).json({
      success: true,
      data: bootcamp,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
    });
  }
};

/**
 * @desc    Create new bootcamp
 * @route   GET /api/v1/bootcamps
 * @access  Private
 */
export const createBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body);

    res.status(201).json({
      success: true,
      data: bootcamp,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
    });
  }
};

/**
 * @desc    Update bootcamp
 * @route   PUT /api/v1/bootcamps/:bootcampId
 * @access  Private
 */
export const updateBootcamp = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: `Update bootcamp ${req.params.bootcampId}`,
  });
};

/**
 * @desc    Delete bootcamp
 * @route   DELETE /api/v1/bootcamps/:bootcampId
 * @access  Private
 */
export const deleteBootcamp = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: `Delete bootcamp ${req.params.bootcampId}`,
  });
};
