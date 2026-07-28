const { SUPPORTED_STATES, normalizeState } = require('../scripts/states.config');

/**
 * Validates date string format YYYY-MM-DD and ensures it is a valid calendar date
 */
function isValidDateString(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return false;
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) return false;
  const date = new Date(dateStr);
  return !isNaN(date.getTime()) && date.toISOString().startsWith(dateStr);
}

/**
 * Standardized Success Response Envelope
 */
function sendSuccess(res, data, meta = {}, statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    data,
    meta: {
      count: Array.isArray(data) ? data.length : 1,
      ...meta
    }
  });
}

/**
 * Standardized Error Response Envelope
 */
function sendError(res, code, message, statusCode = 400, details = null) {
  const response = {
    success: false,
    error: {
      code,
      message
    }
  };
  if (details) response.error.details = details;
  return res.status(statusCode).json(response);
}

module.exports = {
  isValidDateString,
  sendSuccess,
  sendError,
  normalizeState,
  SUPPORTED_STATES
};
