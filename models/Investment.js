const mongoose = require("mongoose");

const investmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  plan: { type: mongoose.Schema.Types.ObjectId, ref: "Plan", required: true },
  amount: { type: Number, required: true },
  profit: { type: Number, required: true },
  status: {
  type: String,
  enum: ["pending", "active", "completed"], // 👈 added "pending"
  default: "pending",
},

  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model("Investment", investmentSchema);
