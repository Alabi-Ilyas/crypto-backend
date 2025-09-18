const axios = require("axios");

exports.getOHLC = async (req, res) => {
  try {
    const { coin } = req.params;
    const { days } = req.query;

    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${coin}/ohlc`,
      { params: { vs_currency: "usd", days } }
    );

    // Transform CoinGecko array to objects for frontend
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

    res.json(ohlcData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching crypto data" });
  }
};

// cryptoController.js
exports.getMarkets = async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/coins/markets",
      {
        params: {
          vs_currency: "usd",
          order: "market_cap_desc",
          per_page: 10, // number of coins to fetch
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

    res.json(data);
  } catch (err) {
    console.error("Error fetching market data:", err.message);
    res.status(500).json({ message: "Error fetching market data" });
  }
};
