/**
 * Middleware to provide advanced query results for Mongoose models.
 * Supports filtering, field selection, sorting, pagination, and population.
 *
 * @param {mongoose.Model} model - The Mongoose model to query.
 * @param {Object|String} [populate] - Population options for Mongoose's populate method.
 * @returns {Function} Express middleware function that attaches results to res.advancedResults.
 *
 * @example
 * ? Usage in a route
 * router.get('/api/v1/resources', advancedResults(ResourceModel, 'relatedField'), controllerMethod);
 *
 * ? Query parameters supported:
 *  - Filtering: /api/v1/resources?field=value
 *  - Operators: /api/v1/resources?field[gt]=value
 *  - Field selection: /api/v1/resources?select=field1,field2
 *  - Sorting: /api/v1/resources?sort=field1,-field2
 *  - Pagination: /api/v1/resources?page=2&limit=10
 */
const advancedResults = (model, populate) => async (req, res, next) => {
  let query;

  // Copy req.query
  const reqQuery = { ...req.query };
  // Fields to exclude
  const removeFields = ["select", "sort", "page", "limit"];

  // Loop over remove fields and delete them from req.query
  removeFields.forEach((param) => delete reqQuery[param]);

  // Create the query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $get, etc.)
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  // Finding the resource
  query = model.find(JSON.parse(queryStr));

  // Select fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments();

  query = query.skip(startIndex).limit(limit);

  if (populate) {
    query = query.populate(populate);
  }

  // Executing query
  const results = await query;

  // Pagination Result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.previous = {
      page: page - 1,
      limit,
    };
  }

  res.advancedResults = {
    success: true,
    count: results.length,
    pagination,
    data: results,
  };

  next();
};

export default advancedResults;
