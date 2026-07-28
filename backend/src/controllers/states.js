const { SUPPORTED_STATES, sendSuccess } = require('../validators');

/**
 * GET /v1/states
 * Returns list of supported states in v1
 */
function getStates(req, res) {
  return sendSuccess(res, SUPPORTED_STATES, {
    description: 'List of supported Indian states for Mandi prices'
  });
}

module.exports = { getStates };
