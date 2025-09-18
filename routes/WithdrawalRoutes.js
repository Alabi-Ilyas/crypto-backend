const express = require("express");
const {
  requestWithdrawal,
  getUserWithdrawals,
  getAllWithdrawals,
  updateWithdrawalStatus,
} = require("../controllers/WithdrawalController");
const  {protect}  = require("../middleware/authMiddleware");

const router = express.Router();

// User routes
router.post("/", protect, requestWithdrawal);
router.get("/", protect, getUserWithdrawals);

// Admin routes
router.get("/all", protect, getAllWithdrawals);
router.put("/:id/status", protect, updateWithdrawalStatus);

module.exports = router;
