const express = require("express");
const {
  createInvestment,
  getUserInvestments,
  getAllInvestments,
  updateInvestmentStatus
} = require("../controllers/investmentcontroller");

const {protect,admin} = require("../middleware/authMiddleware");

const router = express.Router();

// Protected user routes
router.post("/", protect, createInvestment);
router.get("/", protect, getUserInvestments);

// Admin route (you can later add admin check middleware)
router.get("/all", protect, getAllInvestments);
router.put("/:id/status", protect, admin, updateInvestmentStatus);

module.exports = router;
