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
