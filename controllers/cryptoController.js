const axios = require("axios");

// Simple in-memory cache
let marketsCache = null;
let marketsCacheTime = 0;
let ohlcCache = {};
const CACHE_DURATION = 60 * 1000; // 1 minute

// ---------------------- OHLC ----------------------
exports.getOHLC = async (req, res) => {
  try {
    const { coin } = req.params;
    const { days } = req.query;
    const cacheKey = `${coin}-${days}`;
    const now = Date.now();

    // Serve from cache if available
    if (
      ohlcCache[cacheKey] &&
      now - ohlcCache[cacheKey].time < CACHE_DURATION
    ) {
      return res.json(ohlcCache[cacheKey].data);
    }

    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${coin}/ohlc`,
      { params: { vs_currency: "usd", days } }
    );

    const ohlcData = response.data.map((item) => ({
      time: new Date(item[0]).toISOString(),
      open: item[1],
      high: item[2],
      low: item[3],
      close: item[4],
      volume: 0, // CoinGecko OHLC does not provide volume
      diff: item[4] - item[1],
      isGreen: item[4] >= item[1],
    }));

    // Save to cache
    ohlcCache[cacheKey] = { data: ohlcData, time: now };

    res.json(ohlcData);
  } catch (err) {
    console.error("Error fetching OHLC:", err.message);

    if (err.response?.status === 429) {
      return res.status(429).json({
        message: "Rate limit hit. Please try again later.",
        retryAfter: err.response.headers["retry-after"] || 60,
      });
    }

    res.status(500).json({ message: "Error fetching crypto data" });
  }
};

// ---------------------- MARKETS ----------------------
exports.getMarkets = async (req, res) => {
  try {
    const now = Date.now();

    // Serve cached data if it's still fresh
    if (marketsCache && now - marketsCacheTime < CACHE_DURATION) {
      return res.json(marketsCache);
    }

    const response = await axios.get(
      "https://api.coingecko.com/api/v3/coins/markets",
      {
        params: {
          vs_currency: "usd",
          order: "market_cap_desc",
          per_page: 10,
          page: 1,
          sparkline: false,
        },
      }
    );

    const data = response.data.map((coin) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol.toUpperCase(),
      price: coin.current_price,
      change24h: coin.price_change_percentage_24h,
      volume: coin.total_volume,
      marketCap: coin.market_cap,
    }));

    // Save to cache
    marketsCache = data;
    marketsCacheTime = now;

    res.json(data);
  } catch (err) {
    console.error("Error fetching market data:", err.message);

    if (err.response?.status === 429) {
      return res.status(429).json({
        message: "Rate limit hit. Please try again later.",
        retryAfter: err.response.headers["retry-after"] || 60,
      });
    }

    res.status(500).json({ message: "Error fetching market data" });
  }
};
