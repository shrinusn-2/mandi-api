const { supabase } = require('../db');
const { sendSuccess, sendError, normalizeState, SUPPORTED_STATES } = require('../validators');

/**
 * GET /v1/commodities
 * Query params: state (optional), market (optional)
 */
async function getCommodities(req, res) {
  try {
    const { state, market } = req.query;
    let query = supabase.from('mandi_prices').select('commodity');

    let matchedState = null;
    if (state) {
      matchedState = normalizeState(state);
      if (!matchedState) {
        return sendError(
          res,
          'INVALID_STATE',
          `Unknown state "${state}". Supported states are: ${SUPPORTED_STATES.join(', ')}`,
          404
        );
      }
      query = query.eq('state', matchedState);
    }

    if (market && market.trim()) {
      query = query.ilike('market', `%${market.trim()}%`);
    }

    const { data, error } = await query;

    if (error || !data) {
      return sendSuccess(res, [], {
        state: matchedState || null,
        market: market || null
      });
    }

    // Extract unique commodities
    const uniqueCommodities = Array.from(new Set(data.map(item => item.commodity))).sort();

    return sendSuccess(res, uniqueCommodities, {
      state: matchedState || 'ALL',
      market: market || 'ALL'
    });
  } catch (err) {
    return sendError(res, 'SERVER_ERROR', err.message, 500);
  }
}

module.exports = { getCommodities };
