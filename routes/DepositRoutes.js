const express = require("express");
const {
  createDeposit,
  getUserDeposits,
  getAllDeposits,
  updateDepositStatus,
} = require("../controllers/depositController");
const {protect} = require("../middleware/authMiddleware");

const router = express.Router();

// User routes
router.post("/", protect, createDeposit);
router.get("/", protect, getUserDeposits);

// Admin routes
router.get("/all", protect, getAllDeposits);
router.put("/:id/status", protect, updateDepositStatus);

module.exports = router;
