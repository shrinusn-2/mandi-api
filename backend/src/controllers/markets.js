const { supabase } = require('../db');
const { sendSuccess, sendError, normalizeState, SUPPORTED_STATES } = require('../validators');

/**
 * GET /v1/markets
 * Required query param: state
 */
async function getMarkets(req, res) {
  try {
    const { state } = req.query;

    if (!state) {
      return sendError(
        res,
        'MISSING_PARAM',
        'Query parameter "state" is required.',
        400
      );
    }

    const matchedState = normalizeState(state);
    if (!matchedState) {
      return sendError(
        res,
        'INVALID_STATE',
        `Unknown state "${state}". Supported states are: ${SUPPORTED_STATES.join(', ')}`,
        404
      );
    }

    const { data, error } = await supabase
      .from('mandi_prices')
      .select('market, district')
      .eq('state', matchedState);

    if (error) {
      return sendSuccess(res, [], { state: matchedState });
    }

    // De-duplicate markets with district info
    const marketMap = new Map();
    data.forEach(item => {
      if (item.market && !marketMap.has(item.market)) {
        marketMap.set(item.market, { market: item.market, district: item.district });
      }
    });

    const markets = Array.from(marketMap.values()).sort((a, b) => a.market.localeCompare(b.market));

    return sendSuccess(res, markets, { state: matchedState });
  } catch (err) {
    return sendError(res, 'SERVER_ERROR', err.message, 500);
  }
}

module.exports = { getMarkets };
