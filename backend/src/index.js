require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const { getStates } = require('./controllers/states');
const { getCommodities } = require('./controllers/commodities');
const { getMarkets } = require('./controllers/markets');
const { getPrices, getPriceHistory } = require('./controllers/prices');
const { sendError, sendSuccess } = require('./validators');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Rate limit exceeded. Maximum 100 requests per 15 minutes allowed per IP.'
    }
  }
});

app.use('/v1', apiLimiter);

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Mandi Price API',
    version: 'v1',
    timestamp: new Date().toISOString()
  });
});

// Root & /v1 Welcome Index
const welcomeHandler = (req, res) => {
  return res.json({
    success: true,
    message: 'Welcome to Mandi Price API v1',
    endpoints: {
      health: '/health',
      states: '/v1/states',
      commodities: '/v1/commodities?state=Maharashtra',
      markets: '/v1/markets?state=Maharashtra',
      prices: '/v1/prices?state=Maharashtra&commodity=Onion',
      history: '/v1/prices/history?state=Maharashtra&commodity=Onion'
    }
  });
};

app.get('/', welcomeHandler);
app.get('/v1', welcomeHandler);

// v1 API Routes
app.get('/v1/states', getStates);
app.get('/v1/commodities', getCommodities);
app.get('/v1/markets', getMarkets);
app.get('/v1/prices', getPrices);
app.get('/v1/prices/history', getPriceHistory);

app.use((req, res) => {
  return sendError(res, 'ENDPOINT_NOT_FOUND', `Route ${req.method} ${req.path} does not exist on this server.`, 404);
});

app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  return sendError(res, 'INTERNAL_SERVER_ERROR', 'An unexpected error occurred.', 500);
});

app.listen(PORT, () => {
  console.log(`🚀 Mandi Price API server running on port ${PORT}`);
});
