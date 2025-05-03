/**
 * Custom error class for API error responses
 * @extends Error
 */
class ErrorResponse extends Error {
  /**
   * Create an error response
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code
   */
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export default ErrorResponse;
