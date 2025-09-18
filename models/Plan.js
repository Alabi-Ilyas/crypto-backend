const mongoose = require("mongoose");

const planSchema = new mongoose.Schema(
  {
    planName: { type: String, required: true }, // e.g. "Starter Plan"
    profitPercent: { type: Number, required: true }, // e.g. 5 for 5%
    durationHours: { type: Number, required: true }, // e.g. 24 for 24h
    minAmount: { type: Number, required: true }, // e.g. 25
    maxAmount: { type: Number, required: true }, // e.g. 200
    referralBonusPercent: { type: Number }, // optional, e.g. 5
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Plan", planSchema);
