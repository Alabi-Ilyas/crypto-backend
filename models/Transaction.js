// models/Transaction.js
const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["deposit", "withdrawal", "investment"], required: true },
    amount: { type: Number, required: true },
    method: { type: String, required: true },
    reference: { type: String },
    investmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Investment" }, // ✅ link to investment
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
