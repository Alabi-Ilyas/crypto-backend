const express = require("express");
const router = express.Router();
const { getOHLC,getMarkets } = require("../controllers/cryptoController");

router.get("/:coin/ohlc", getOHLC);
router.get("/markets", getMarkets); 
module.exports = router;
