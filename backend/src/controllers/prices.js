const { supabase } = require('../db');
const { sendSuccess, sendError, normalizeState, isValidDateString, SUPPORTED_STATES } = require('../validators');

/**
 * GET /v1/prices
 * Params:
 *  Required: state OR commodity
 *  Optional: market, commodity, variety, date
 */
async function getPrices(req, res) {
  try {
    const { state, commodity, market, variety, date } = req.query;

    if (!state && !commodity) {
      return sendError(
        res,
        'MISSING_PARAM',
        'At least one of query parameters "state" or "commodity" is required.',
        400
      );
    }

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
    }

    if (date && !isValidDateString(date)) {
      return sendError(
        res,
        'INVALID_DATE',
        'Parameter "date" must be a valid date in YYYY-MM-DD format.',
        400
      );
    }

    let query = supabase.from('mandi_prices').select('*');

    if (matchedState) query = query.eq('state', matchedState);
    if (commodity) query = query.ilike('commodity', commodity.trim());
    if (market) query = query.ilike('market', `%${market.trim()}%`);
    if (variety) query = query.ilike('variety', `%${variety.trim()}%`);
    if (date) query = query.eq('arrival_date', date);

    // Default sorting by latest date
    query = query.order('arrival_date', { ascending: false }).limit(200);

    const { data, error } = await query;

    if (error) {
      return sendSuccess(res, [], {
        state: matchedState || state || null,
        commodity: commodity || null,
        note: 'No records match your query or database table is initializing'
      });
    }

    return sendSuccess(res, data || [], {
      state: matchedState || state || 'ALL',
      commodity: commodity || 'ALL',
      market: market || 'ALL',
      date: date || 'LATEST'
    });
  } catch (err) {
    return sendError(res, 'SERVER_ERROR', err.message, 500);
  }
}

/**
 * GET /v1/prices/history
 * Required params: state AND commodity
 * Optional params: market, from, to
 */
async function getPriceHistory(req, res) {
  try {
    const { state, commodity, market, from, to } = req.query;

    if (!state || !commodity) {
      return sendError(
        res,
        'MISSING_PARAM',
        'Both "state" and "commodity" query parameters are required for history trends.',
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

    if (from && !isValidDateString(from)) {
      return sendError(
        res,
        'INVALID_DATE',
        'Parameter "from" must be a valid date in YYYY-MM-DD format.',
        400
      );
    }

    if (to && !isValidDateString(to)) {
      return sendError(
        res,
        'INVALID_DATE',
        'Parameter "to" must be a valid date in YYYY-MM-DD format.',
        400
      );
    }

    let query = supabase
      .from('mandi_prices')
      .select('*')
      .eq('state', matchedState)
      .ilike('commodity', commodity.trim());

    if (market) {
      query = query.ilike('market', `%${market.trim()}%`);
    }

    if (from) query = query.gte('arrival_date', from);
    if (to) query = query.lte('arrival_date', to);

    query = query.order('arrival_date', { ascending: true });

    const { data, error } = await query;

    if (error || !data) {
      return sendSuccess(res, [], {
        state: matchedState,
        commodity
      });
    }

    // If market IS specified, return market specific rows directly
    if (market) {
      return sendSuccess(res, data, {
        state: matchedState,
        commodity,
        market,
        mode: 'MARKET_SPECIFIC'
      });
    }

    // Aggregate by arrival_date if market is omitted
    const dateMap = new Map();
    data.forEach(row => {
      const d = row.arrival_date;
      if (!dateMap.has(d)) {
        dateMap.set(d, {
          arrival_date: d,
          modal_prices: [],
          min_prices: [],
          max_prices: []
        });
      }
      const entry = dateMap.get(d);
      if (row.modal_price != null) entry.modal_prices.push(Number(row.modal_price));
      if (row.min_price != null) entry.min_prices.push(Number(row.min_price));
      if (row.max_price != null) entry.max_prices.push(Number(row.max_price));
    });

    const aggregatedHistory = Array.from(dateMap.values()).map(item => {
      const avgModal = item.modal_prices.length > 0
        ? Math.round(item.modal_prices.reduce((a, b) => a + b, 0) / item.modal_prices.length)
        : null;
      const avgMin = item.min_prices.length > 0
        ? Math.round(item.min_prices.reduce((a, b) => a + b, 0) / item.min_prices.length)
        : null;
      const avgMax = item.max_prices.length > 0
        ? Math.round(item.max_prices.reduce((a, b) => a + b, 0) / item.max_prices.length)
        : null;

      return {
        arrival_date: item.arrival_date,
        avg_modal_price: avgModal,
        avg_min_price: avgMin,
        avg_max_price: avgMax,
        data_points: item.modal_prices.length
      };
    });

    return sendSuccess(res, aggregatedHistory, {
      state: matchedState,
      commodity,
      mode: 'STATE_AVERAGE'
    });
  } catch (err) {
    return sendError(res, 'SERVER_ERROR', err.message, 500);
  }
}

module.exports = {
  getPrices,
  getPriceHistory
};
