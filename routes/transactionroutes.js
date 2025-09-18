const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const {
  getUserTransactions,
  createTransaction,
  getAllTransactions,
  approveTransaction,
} = require("../controllers/transactionController");

// User routes
router.get("/user", protect, getUserTransactions); // Get user's own transactions
router.post("/", protect, createTransaction); // User creates a transaction (optional)

// Admin route
router.get("/", protect, admin, getAllTransactions);
router.put("/approve/:id",protect, admin, approveTransaction); // Admin gets all transactions

module.exports = router;
