// cryptoController.js
const axios = require("axios");

// Simple in-memory cache
// You can later replace this with Redis or a database if needed
let cache = {};

// Helper function: check cache
function getFromCache(key, ttl = 60000) {
  if (cache[key] && Date.now() - cache[key].timestamp < ttl) {
    return cache[key].data;
  }
  return null;
}

// OHLC endpoint
exports.getOHLC = async (req, res) => {
  try {
    const { coin } = req.params;
    const { days } = req.query;
    const key = `ohlc_${coin}_${days}`;

    // ✅ Check cache first
    const cachedData = getFromCache(key, 60000); // cache for 60s
    if (cachedData) {
      return res.json(cachedData);
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

    // ✅ Save in cache
    cache[key] = { data: ohlcData, timestamp: Date.now() };

    res.json(ohlcData);
  } catch (err) {
    console.error("Error fetching OHLC data:", err.message);
    res.status(500).json({ message: "Error fetching crypto OHLC data" });
  }
};

// Markets endpoint
exports.getMarkets = async (req, res) => {
  try {
    const key = "markets";

    // ✅ Check cache (2 minutes for markets)
    const cachedData = getFromCache(key, 120000);
    if (cachedData) {
      return res.json(cachedData);
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

    // ✅ Save in cache
    cache[key] = { data, timestamp: Date.now() };

    res.json(data);
  } catch (err) {
    console.error("Error fetching market data:", err.message);
    res.status(500).json({ message: "Error fetching market data" });
  }
};
