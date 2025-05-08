/**
 * Middleware to handle asynchronous route handlers and forward errors to Express error handlers.
 *
 * @param {Function} fn - The asynchronous route handler function to wrap.
 * @returns {Function} A middleware function that executes the async function and catches errors.
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export default asyncHandler;
