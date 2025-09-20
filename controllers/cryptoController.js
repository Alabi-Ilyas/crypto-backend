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
// cryptoController.js
exports.getOHLC = async (req, res) => {
  try {
    const { coin } = req.params;
    let { days } = req.query;

    // ✅ Validate days
    const allowedDays = ["1", "7", "14", "30", "90", "180", "365", "max"];
    if (!allowedDays.includes(days)) {
      days = "1"; // fallback default
    }

    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${coin}/ohlc`,
      { params: { vs_currency: "usd", days } }
    );

    if (!response.data || !Array.isArray(response.data)) {
      return res.status(500).json({ message: "Invalid OHLC response from CoinGecko" });
    }

    const ohlcData = response.data.map((item) => ({
      time: new Date(item[0]).toISOString(),
      open: item[1],
      high: item[2],
      low: item[3],
      close: item[4],
      volume: 0,
      diff: item[4] - item[1],
      isGreen: item[4] >= item[1],
    }));

    res.json(ohlcData);
  } catch (err) {
    console.error("Error fetching OHLC:", err.response?.data || err.message);
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
