const express = require("express");
const { getSecurityEvents } = require("../controllers/securityController");
const {protect} = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/events", protect, getSecurityEvents);

module.exports = router;
