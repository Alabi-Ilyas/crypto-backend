const mongoose = require("mongoose");

const depositSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    method: { type: String, required: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    transactionId: { type: String }, // optional
  },
  { timestamps: true }
);

module.exports = mongoose.model("Deposit", depositSchema);
