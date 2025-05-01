/**
 * @desc    Get all bootcamps
 * @route   GET /api/v1/bootcamps
 * @access  Public
 */
export const getBootcamps = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: "Show all bootcamps",
  });
};

/**
 * @desc    Get single bootcamps
 * @route   GET /api/v1/bootcamps/:bootcampId
 * @access  Public
 */
export const getBootcamp = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: `Show bootcamp ${req.params.bootcampId}`,
  });
};

/**
 * @desc    Create new bootcamp
 * @route   GET /api/v1/bootcamps
 * @access  Private
 */
export const createBootcamp = (req, res, next) => {
  res.status(201).json({
    success: true,
    msg: "Create a new bootcamp",
  });
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
